package net.shyller.offer.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.*;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import net.shyller.offer.db.domain.Pay;
import net.shyller.offer.db.domain.User;
import net.shyller.offer.db.repository.PayRepository;
import net.shyller.offer.db.repository.UserRepository;
import net.shyller.offer.dto.PaymentRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    private final CustomUserDetailsService customUserDetailsService;
    private final UserRepository userRepository;
    @Value("${tinkoff.terminal_key}")
    private String terminalKey;

    @Value("${tinkoff.secret_key}")
    private String secretKey;

    @Value("${app-url}")
    private String appUrl;

    private final RestTemplate restTemplate;
    private final PayRepository payRepository;

//    public String createPaymentToken(PaymentRequest paymentRequest) throws NoSuchAlgorithmException {
//        String url = "https://securepay.tinkoff.ru/v2/Init";
//        User user = userRepository.findById(paymentRequest.getUserId()).orElseThrow(() -> new EntityNotFoundException("User not found"));
//
//        Map<String, Object> data = new HashMap<>();
//        data.put("TerminalKey", terminalKey);
//        data.put("Amount", String.valueOf((int) (paymentRequest.getAmount() * 100)));
//        data.put("OrderId", String.valueOf(System.currentTimeMillis()));
//        data.put("Description", "Приобретение подписки на 950 рублей");
//        data.put("Password", secretKey);
//
//        Pay pay = Pay.builder().user(user).status("init").email(paymentRequest.getEmail()).build();
//        payRepository.save(pay);
//
//        String hashedToken = generateToken(data);
//        data.put("Token", hashedToken);
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_JSON);
//
//        HttpEntity<Map<String, String>> entity = new HttpEntity<>(data, headers);
//        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
//
//        return response.getBody();
//    }

    @Transactional
    public Map<String, String> payInit(UUID userId, String userEmail, String backUrl) throws NoSuchAlgorithmException   {
        User user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found"));

        Pay newPay = Pay.builder()
                .user(user)
                .status("init")
                .email(userEmail)
                .timestamp(OffsetDateTime.now())
                .build();

        payRepository.save(newPay);

        int paymentAmount = 10 * 100;
        String orderId = String.format("%s-%s", newPay.getId(), System.currentTimeMillis());
        String description = String.format("Оплата заказа №%s", newPay.getId());
        String successUrl = backUrl;
        String failUrl = backUrl;

        Map<String, Object> receipt = new HashMap<>();
        receipt.put("Items", Arrays.asList(
                Map.of("Name", "Продление подписки", "Price", paymentAmount, "Quantity", 1, "Amount", paymentAmount, "Tax", "none")
        ));
        receipt.put("Email", userEmail);
        receipt.put("Taxation", "osn");


        Map<String, Object> data = new HashMap<>();
        data.put("TerminalKey", terminalKey);
        data.put("Amount", paymentAmount);
        data.put("OrderId", orderId);
        data.put("Description", description);
        data.put("SuccessURL", successUrl);
        data.put("FailURL", failUrl);
        data.put("NotificationURL", String.format("%s/pay/notification", appUrl));
        data.put("Recurrent", "Y");

        Map<String, Object> dataForToken = new HashMap<>();
        dataForToken.put("TerminalKey", terminalKey);
        dataForToken.put("Amount", String.valueOf(paymentAmount));
        dataForToken.put("OrderId", orderId);
        dataForToken.put("Description", description);
        dataForToken.put("SuccessURL", successUrl);
        dataForToken.put("FailURL", failUrl);
        dataForToken.put("NotificationURL", String.format("%s/pay/notification", appUrl));
        dataForToken.put("Password", secretKey);  // Correct Password
        dataForToken.put("Recurrent", "Y");  // Ensure Recurrent in token generation

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
            throw new IllegalArgumentException("user_id is required");
        }

        Pay payInfo = payRepository.findFirstByUserIdOrderByIdDesc(userId)
                .orElseThrow(() -> new RuntimeException("Pay info not found"));

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

    public Pay cancelPayment(UUID userId) {
        Pay payInfo = payRepository.findFirstByUserIdOrderByIdDesc(userId)
                .orElseThrow(() -> new RuntimeException("Pay info not found"));

        String newStatus = "canceled_by_user";
        payInfo.setStatus(newStatus);

        payRepository.save(payInfo);

        return payInfo;
    }

    public void handlePaymentNotification(Map<String, Object> data) {
        String orderId = (String) data.get("OrderId");
        String status = (String) data.get("Status");

        Pay payment = payRepository.findFirstByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Payment info not found"));

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
        }

        payRepository.save(payment);

        logNotificationData(data);
    }

    private void logNotificationData(Map<String, Object> data) {
        try {
            java.nio.file.Files.write(java.nio.file.Paths.get("notification_data.json"),
                    (new com.fasterxml.jackson.databind.ObjectMapper()).writeValueAsString(data).getBytes(),
                    java.nio.file.StandardOpenOption.APPEND);
        } catch (Exception e) {
            throw new RuntimeException("Error logging notification data", e);
        }
    }

    public String getPaymentStatus(String paymentId) throws NoSuchAlgorithmException {
        String url = "https://securepay.tinkoff.ru/v2/GetState";

        Map<String, String> requestData = new HashMap<>();
        requestData.put("TerminalKey", terminalKey);
        requestData.put("PaymentId", paymentId);

        Map<String, Object> dataForToken = new HashMap<>();
        dataForToken.put("TerminalKey", terminalKey);
        dataForToken.put("PaymentId", paymentId);
        dataForToken.put("Password", secretKey);

        String token = generateToken(dataForToken);

        requestData.put("Token", token);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(requestData, headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

        return response.getBody();
    }

    public void cancelSubscription(String paymentId) {
        User currentUser = customUserDetailsService.getCurrentUser();
        Pay payment = payRepository.findFirstByUserIdOrderByIdDesc(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Pay info not found"));

        if (payment == null) {
            throw new RuntimeException("Payment info not found for user " + currentUser.getId());
        }

        payment.setStatus("canceled_by_user");
        payment.setPaidUntil(null);
        payRepository.save(payment);
    }

    public void charge() {
        logger.debug("Начинаем обработку платежей: " + LocalDateTime.now());
        List<Pay> pays = payRepository.findAll();
        Set<UUID> users = new HashSet<>();
        for (Pay pay : pays) {
            if (users.contains(pay.getUser().getId()) || pay.getTimestamp() == null) {
                continue;
            }
            UUID userId = pay.getUser().getId();
            users.add(userId);
            LocalDate now = LocalDate.now();
            if (pay.getTimestamp().toLocalDate().equals(now) && !pay.getStatus().equals("canceled_by_user")) {
                try {
                    // Обработка платежа
                    processRecurrentPayment(pay);
                } catch (Exception e) {
                    throw new RuntimeException("Error processing payment for userId: " + userId, e);
                }
            }
        }
    }

    private void processRecurrentPayment(Pay pay) throws JsonProcessingException, NoSuchAlgorithmException {
        User user =
            userRepository
                .findById(pay.getUser().getId())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Pay newPay = Pay.builder().user(user).email(pay.getEmail()).build();

        int paymentAmount = 950 * 100;
        String orderId = user.getId() + "-" + newPay.getId() + "-rebill-" + System.currentTimeMillis();
        String description = "Оплата подписки";
        String successUrl = "https://admin.flourum.ru/profile";
        String failUrl = "https://admin.flourum.ru/profile";

        Map<String, Object> receipt = new HashMap<>();
        receipt.put("Items", Arrays.asList(
                Map.of("Name", "Продление подписки", "Price", paymentAmount, "Quantity", 1, "Amount", paymentAmount, "Tax", "none")
        ));
        receipt.put("Email", pay.getEmail());
        receipt.put("Taxation", "osn");

        Map<String, Object> data = new HashMap<>();
        data.put("TerminalKey", terminalKey);
        data.put("Amount", paymentAmount);
        data.put("OrderId", orderId);
        data.put("Description", description);
        data.put("SuccessURL", successUrl);
        data.put("FailURL", failUrl);
        data.put("NotificationURL", "https://api.flourum.ru/pay/notification");
        data.put("DATA", Map.of("Email", pay.getEmail()));
        data.put("Receipt", receipt);
        data.put("Recurrent", "Y");

        Map<String, Object> dataForToken = new HashMap<>();
        dataForToken.put("TerminalKey", terminalKey);
        dataForToken.put("Amount", String.valueOf(paymentAmount));
        dataForToken.put("OrderId", orderId);
        dataForToken.put("Description", description);
        dataForToken.put("Password", secretKey);

        String token = generateToken(dataForToken);
        data.put("Token", token);

        String url = "https://securepay.tinkoff.ru/v2/Init";
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, new HttpEntity<>(data), String.class);
        if (response.getStatusCode() == HttpStatus.OK) {
            String responseData = response.getBody();
            if (responseData != null) {
                Map responseJson = new ObjectMapper().readValue(responseData, Map.class);
                if ("Success".equals(responseJson.get("Success"))) {
                    String paymentId = (String) responseJson.get("PaymentId");
                    newPay.setPaymentId(paymentId);
                    newPay.setOrderId(orderId);
                    newPay.setStatus("subscription_init");

                    payRepository.save(newPay);

                    chargeRecurrentPayment(paymentId, pay.getRebillId());
                } else {
                    throw new RuntimeException("Ошибка инициализации платежа: " + responseJson.get("Message"));
                }
            }
        } else {
            throw new RuntimeException("Ошибка запроса: " + response.getBody());
        }
    }

    private void chargeRecurrentPayment(String paymentId, String rebillId) throws JsonProcessingException, NoSuchAlgorithmException {
        Map<String, Object> chargeData = new HashMap<>();
        chargeData.put("TerminalKey", terminalKey);
        chargeData.put("PaymentId", paymentId);
        chargeData.put("RebillId", rebillId);

        Map<String, Object> chargeTokenData = new HashMap<>();
        chargeTokenData.put("TerminalKey", terminalKey);
        chargeTokenData.put("PaymentId", paymentId);
        chargeTokenData.put("RebillId", rebillId);
        chargeTokenData.put("Password", secretKey);

        chargeData.put("Token", generateToken(chargeTokenData));

        String chargeUrl = "https://securepay.tinkoff.ru/v2/Charge";
        ResponseEntity<String> chargeResponse = restTemplate.exchange(chargeUrl, HttpMethod.POST, new HttpEntity<>(chargeData), String.class);

        if (chargeResponse.getStatusCode() == HttpStatus.OK) {
            String chargeResponseData = chargeResponse.getBody();
            if (chargeResponseData != null) {
                Map chargeResponseJson = new ObjectMapper().readValue(chargeResponseData, Map.class);
                if ("Success".equals(chargeResponseJson.get("Success"))) {
                    System.out.println("Рекуррентный платеж успешно проведен.");
                } else {
                    System.out.println("Ошибка рекуррентного платежа: " + chargeResponseJson.get("Message"));
                }
            }
        } else {
            System.out.println("Ошибка запроса на рекуррентный платеж: " + chargeResponse.getBody());
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

        // Генерация токена с использованием SHA-256
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hashBytes = digest.digest(concatenatedValues.toString().getBytes());
        StringBuilder hexString = new StringBuilder();
        for (byte b : hashBytes) {
            hexString.append(String.format("%02x", b));
        }
        return hexString.toString();
    }
}
