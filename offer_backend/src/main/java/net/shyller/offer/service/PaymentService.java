package net.shyller.offer.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.*;
import java.util.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import net.shyller.offer.db.domain.Pay;
import net.shyller.offer.db.domain.User;
import net.shyller.offer.db.repository.PayRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);
    private static final Integer SUBCRIPTION_PRICE = 950 * 100;

    private final UserService userService;

    @Value("${tinkoff.terminal_key}")
    private String terminalKey;

    @Value("${tinkoff.secret_key}")
    private String secretKey;

    @Value("${app-url}")
    private String appUrl;

    private final RestTemplate restTemplate;
    private final PayRepository payRepository;

    @Transactional
    public Map<String, String> payInit(UUID userId, String userEmail, String backUrl) throws NoSuchAlgorithmException   {
        User user = userService.getById(userId);

        Pay newPay = Pay.builder()
                .user(user)
                .status("init")
                .email(userEmail)
                .timestamp(OffsetDateTime.now())
                .build();

        payRepository.save(newPay);

        String orderId = String.format("%s-%s", newPay.getId(), System.currentTimeMillis());
        String description = String.format("Оплата заказа №%s", newPay.getId());
        String successUrl = backUrl;
        String failUrl = backUrl;

        Map<String, Object> receipt = new HashMap<>();
        receipt.put("Items", Arrays.asList(
                Map.of("Name", "Продление подписки", "Price", SUBCRIPTION_PRICE, "Quantity", 1, "Amount", SUBCRIPTION_PRICE, "Tax", "none")
        ));
        receipt.put("Email", userEmail);
        receipt.put("Taxation", "osn");

        Map<String, Object> data = new HashMap<>();
        data.put("TerminalKey", terminalKey);
        data.put("Amount", SUBCRIPTION_PRICE);
        data.put("OrderId", orderId);
        data.put("Description", description);
        data.put("SuccessURL", successUrl);
        data.put("FailURL", failUrl);
        data.put("NotificationURL", String.format("%s/api/pay/notification", appUrl));
        data.put("Recurrent", "Y");

        Map<String, Object> dataForToken = new HashMap<>();
        dataForToken.put("TerminalKey", terminalKey);
        dataForToken.put("Amount", String.valueOf(SUBCRIPTION_PRICE));
        dataForToken.put("OrderId", orderId);
        dataForToken.put("Description", description);
        dataForToken.put("SuccessURL", successUrl);
        dataForToken.put("FailURL", failUrl);
        dataForToken.put("NotificationURL", String.format("%s/api/pay/notification", appUrl));
        dataForToken.put("Password", secretKey);
        dataForToken.put("Recurrent", "Y");

        String token = generateToken(dataForToken);
        data.put("Token", token.toLowerCase());
        data.put("DATA", Map.of("Email", userEmail));
        data.put("Receipt", receipt);

        String url = "https://securepay.tinkoff.ru/v2/Init";
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, new HttpEntity<>(data), String.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            try {
                String responseData = response.getBody();
                if (responseData != null) {
                    Map<String, Object> responseJson = new ObjectMapper().readValue(responseData, Map.class);
                    if ((boolean) responseJson.get("Success")) {
                        String paymentUrl = (String) responseJson.get("PaymentURL");
                        newPay.setPaymentId((String) responseJson.get("PaymentId"));
                        newPay.setOrderId(orderId);
                        newPay.setStatus("subscription_init");
                        payRepository.save(newPay);

                        Map<String, String> result = new HashMap<>();
                        result.put("url", paymentUrl);
                        return result;
                    } else {
                        throw new RuntimeException("Ошибка инициализации платежа: " + responseJson.get("Message"));
                    }
                }
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Ошибка обработки ответа от Tinkoff", e);
            }
        } else {
            throw new RuntimeException("Ошибка запроса к Tinkoff: " + response.getBody());
        }

        return Collections.emptyMap();
    }

    public Map<String, Object> checkPaymentStatus(UUID userId) {
        if (userId == null) {
            throw new IllegalArgumentException("userId is required");
        }

        Pay payInfo = payRepository.findFirstByUserIdOrderByIdDesc(userId)
                .orElseThrow(() -> new EntityNotFoundException("Pay info not found"));

        Map<String, Object> answer = new HashMap<>();
        answer.put("currentStatus", payInfo.getStatus());

        if (payInfo.getPan() != null) {
            answer.put("pan", payInfo.getPan());
        }

        OffsetDateTime timestamp = payInfo.getTimestamp();
        if (timestamp != null) {
            answer.put("until", timestamp.plusMinutes(5));
        }

        return answer;
    }

    @Transactional
    public String cancelPayment(UUID userId) {
        Pay payInfo = payRepository.findFirstByUserIdOrderByIdDesc(userId)
                .orElseThrow(() -> new RuntimeException("Pay info not found"));

        String newStatus = "canceled_by_user";
        payInfo.setStatus(newStatus);
        userService.cancelSubscription(userId);

        payRepository.save(payInfo);

        return payInfo.getStatus();
    }

    public void handlePaymentNotification(Map<String, Object> data) {
        String orderId = (String) data.get("OrderId");
        String status = (String) data.get("Status");

        Pay payment =
            payRepository
                .findFirstByOrderId(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Payment info not found"));

        if (!(boolean) data.get("Success")) {
            payment.setStatus(status);
            payRepository.save(payment);
            return;
        }

        payment.setCardId((String) data.get("CardId"));
        payment.setRebillId((String) data.get("RebillId"));
        payment.setPan((String) data.get("Pan"));
        payment.setStatus(status);

        if ("CONFIRMED".equals(status)) {
            payment.setTimestamp(OffsetDateTime.now());
            userService.updateSubcription(payment.getUser());
        }

        payRepository.save(payment);

        logNotificationData(data);
    }

    private void logNotificationData(Map<String, Object> data) {
        try {
            java.nio.file.Path path = java.nio.file.Paths.get("notification_data.json");
            if (!java.nio.file.Files.exists(path)) {
                java.nio.file.Files.createFile(path);
            }

            String jsonData = new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(data);
            java.nio.file.Files.write(path, (jsonData + "\n").getBytes(), java.nio.file.StandardOpenOption.APPEND);
        } catch (Exception e) {
            throw new RuntimeException("Error logging notification data", e);
        }
    }

    @Scheduled(cron = "0 0 1 * * *")
    protected void runCharge() throws NoSuchAlgorithmException, JsonProcessingException {
        logger.debug("Charge initiated at " + Instant.now());
        charge();
    }

    @Transactional
    public void charge() throws NoSuchAlgorithmException, JsonProcessingException {
        List<Pay> pays = payRepository.findAllByStatusNotIn(Collections.singletonList("canceled_by_user"));
        Set<UUID> users = new HashSet<>();

        ZoneId zoneId = ZoneId.of("Europe/Moscow");
        ZonedDateTime now = ZonedDateTime.now(zoneId);

        for (Pay pay : pays) {
            UUID userId = pay.getUser().getId();
            if (!users.contains(userId) && pay.getTimestamp() != null) {
                users.add(userId);

                ZonedDateTime payTimestamp = ZonedDateTime.ofInstant(pay.getTimestamp().toInstant(), zoneId);

                if (payTimestamp.isBefore(now)) {
                    processPayment(pay);
                }
            }
        }
    }

    private void processPayment(Pay pay) throws NoSuchAlgorithmException, JsonProcessingException {
        String userEmail = pay.getEmail();
        UUID userId = pay.getUser().getId();
        String backUrl = "https://admin.flourum.ru/profile";

        User user = userService.getById(userId);
        Pay latestPay = payRepository.findTopByOrderByIdDesc();

        Pay newPay = new Pay();
        newPay.setUser(user);
        newPay.setStatus("subscription_init");
        newPay.setEmail(userEmail);
        newPay.setOrderId(String.valueOf(latestPay != null ? latestPay.getId() + 1 : 1L));
        payRepository.save(newPay);

        String orderId = userId + "-rebill-" + newPay.getId();
        String description = "Оплата заказа №" + newPay.getId();
        String successUrl = backUrl;
        String failUrl = backUrl;

        Map<String, Object> receipt = new HashMap<>();
        receipt.put("Items", Arrays.asList(
                Map.of("Name", "Продление подписки Flourum", "Price", SUBCRIPTION_PRICE, "Quantity", 1, "Amount", SUBCRIPTION_PRICE, "Tax", "none")
        ));
        receipt.put("Email", userEmail);
        receipt.put("Taxation", "osn");

        Map<String, Object> data = new HashMap<>();
        data.put("TerminalKey", terminalKey);
        data.put("Amount", SUBCRIPTION_PRICE);
        data.put("OrderId", orderId);
        data.put("Description", description);
        data.put("SuccessURL", successUrl);
        data.put("FailURL", failUrl);
        data.put("NotificationURL", String.format("%s/api/pay/notification", appUrl));
        data.put("Recurrent", "Y");

        Map<String, Object> dataForToken = new HashMap<>();
        dataForToken.put("TerminalKey", terminalKey);
        dataForToken.put("Amount", String.valueOf(SUBCRIPTION_PRICE));
        dataForToken.put("OrderId", orderId);
        dataForToken.put("Description", description);
        dataForToken.put("SuccessURL", successUrl);
        dataForToken.put("FailURL", failUrl);
        dataForToken.put("NotificationURL", String.format("%s/api/pay/notification", appUrl));
        dataForToken.put("Password", secretKey);
        dataForToken.put("Recurrent", "Y");

        String token = generateToken(dataForToken);
        data.put("Token", token.toLowerCase());
        data.put("DATA", Map.of("Email", userEmail));
        data.put("Receipt", receipt);

        String url = "https://securepay.tinkoff.ru/v2/Init";
//        Map<String, Object> responseData = restTemplate.postForObject(url, data, Map.class);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, new HttpEntity<>(data), String.class);
        String responseData = response.getBody();
        Map<String, Object> responseJson = new ObjectMapper().readValue(responseData, Map.class);

        if (responseData != null && Boolean.TRUE.equals(responseJson.get("Success"))) {
            String paymentId = (String) responseJson.get("PaymentId");
            newPay.setStatus((String) responseJson.get("Status"));
            newPay.setPaymentId(paymentId);
            newPay.setOrderId(orderId);
            payRepository.save(newPay);

            chargePayment(paymentId, pay.getRebillId());
        } else {
            throw new RuntimeException("Ошибка инициализации платежа: " + responseJson.get("Message"));
        }
    }

    private void chargePayment(String paymentId, String rebillId) throws NoSuchAlgorithmException {
        String url = "https://securepay.tinkoff.ru/v2/Charge";

        Map<String, Object> data = new HashMap<>();
        data.put("TerminalKey", terminalKey);
        data.put("PaymentId", paymentId);
        data.put("RebillId", "145919");

        Map<String, Object> dataForToken = new HashMap<>();
        dataForToken.put("TerminalKey", terminalKey);
        dataForToken.put("PaymentId", paymentId);
        dataForToken.put("RebillId", rebillId);
        dataForToken.put("Password", secretKey);

        String token = generateToken(dataForToken);
        data.put("Token", token);

        Map<String, Object> responseData = restTemplate.postForObject(url, data, Map.class);

        if (responseData != null && Boolean.TRUE.equals(responseData.get("Success"))) {
            System.out.println("Charge successful: " + responseData);
        } else {
            throw new RuntimeException("Ошибка charge: " + responseData.get("Message"));
        }
    }
    /**
     * Генерация токена (SHA-256) для запроса
     * @param data данные для токенизации
     * @return хешированная строка
     */
    private String generateToken(Map<String, Object> data) throws NoSuchAlgorithmException {
        StringBuilder concatenatedValues = new StringBuilder();
        data.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .forEach(entry -> concatenatedValues.append(entry.getValue()));

        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hashBytes = digest.digest(concatenatedValues.toString().getBytes());
        StringBuilder hexString = new StringBuilder();
        for (byte b : hashBytes) {
            hexString.append(String.format("%02x", b));
        }
        return hexString.toString();
    }
}
