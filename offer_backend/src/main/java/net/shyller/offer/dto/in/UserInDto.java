package net.shyller.offer.dto.in;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
@Schema(description = "Сущность создания пользователя")
public class UserInDto {
    @Schema(description = "Логин пользователя")
    @Size(min = 3, max = 50, message = "Логин должен содержать от 3 до 50 символов")
    @NotBlank(message = "Логин не может быть пустым")
    private String username;

    @Schema(description = "Пароль")
    @Size(min = 5, max = 255, message = "Длина пароля должна быть от 5 до 255 символов")
    @NotBlank(message = "Пароль не может быть пустым")
    private String password;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX", timezone = "UTC")
    @Schema(description = "Дата окончания подписки")
    private OffsetDateTime subscriptionExpiresAt;
}
