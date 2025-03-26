package net.shyller.offer.dto.in;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "Запрос на аутентификацию")
public class SignInRequestDto {
    @Schema(description = "Логин пользователя")
    @Size(min = 3, max = 50, message = "Логин должен содержать от 3 до 50 символов")
    @NotBlank(message = "Логин не может быть пустым")
    private String username;

    @Schema(description = "Пароль")
    @Size(min = 5, max = 255, message = "Длина пароля должна быть от 5 до 255 символов")
    @NotBlank(message = "Пароль не может быть пустым")
    private String password;
}
