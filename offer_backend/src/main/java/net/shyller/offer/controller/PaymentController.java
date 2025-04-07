package net.shyller.offer.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import net.shyller.offer.db.domain.Pay;
import net.shyller.offer.dto.PaymentRequest;
import net.shyller.offer.service.PaymentService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.security.NoSuchAlgorithmException;
import java.util.Map;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/pay")
@SecurityRequirement(name = "JWT")
@Tag(name = "Контроллер платежей", description = "Обслуживает платежи")
public class PaymentController {

    private final PaymentService paymentService;

//    @ResponseStatus(HttpStatus.OK)
//    @Operation(summary = "Создание токена оплаты")
//    @ApiResponses(value = {
//            @ApiResponse(
//                    responseCode = "200",
//                    description = "Создание токена оплаты"
//            )
//    })
//    @PostMapping("/create")
//    public String createPaymentToken(@RequestBody PaymentRequest paymentRequest) throws NoSuchAlgorithmException {
//        return paymentService.createPaymentToken(paymentRequest);
//    }

    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Создание токена оплаты")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Создание токена оплаты"
            )
    })
    @PostMapping("/init")
    public Map<String, String> createPaymentToken(
            @RequestParam("userId") UUID userId,
            @RequestParam("userEmail") String userEmail,
            @RequestParam("backUrl") String backUrl) throws NoSuchAlgorithmException {
        return paymentService.payInit(userId, userEmail, backUrl);
    }

    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Получение статуса оплаты")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Проверка статуса оплаты"
            )
    })
    @GetMapping("/check")
    public Map<String, Object> getPaymentStatus(@RequestParam("userId") UUID userId) {
        return paymentService.checkPaymentStatus(userId);
    }

    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Отмена платежа")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Платеж отменен"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Информация о платеже не найдена"
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Ошибка обновления информации о платеже"
            )
    })
    @GetMapping("/cancel")
    public Pay cancelPayment(@RequestParam("userId") UUID userId) {
        return paymentService.cancelPayment(userId);
    }

    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Обработка уведомлений о платеже")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Уведомление обработано"
            )
    })
    @PostMapping("/notification")
    public String handlePaymentNotification(@RequestBody Map<String, Object> data) {
        paymentService.handlePaymentNotification(data);
        return "ok";
    }

    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Получение статуса оплаты")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Проверка статуса оплаты"
            )
    })
    @GetMapping("/status/{paymentId}")
    public String getPaymentStatus(@PathVariable String paymentId) throws NoSuchAlgorithmException {
        return paymentService.getPaymentStatus(paymentId);
    }
}