package net.shyller.offer.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.shyller.offer.dto.in.SignInRequestDto;
import net.shyller.offer.service.AuthenticationService;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
@Tag(name = "Контроллер аутентификации", description = "Обслуживает запрос аутентификации/авторизации")
public class AuthController {
    private final AuthenticationService authenticationService;

    @Operation(summary = "Авторизация пользователя")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Авторизация прошла успешно"
            )
    })
    @PostMapping("/login")
    public void login(HttpServletResponse response, @RequestBody @Valid SignInRequestDto request) {
        authenticationService.authenticate(response, request);
    }
}
