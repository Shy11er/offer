package net.shyller.offer.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import net.shyller.offer.common.RoleName;

import java.io.Serializable;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Schema(description = "Сущность пользователя")
public class UserDto implements Serializable {
    @Schema(description = "Id сущности", requiredMode = Schema.RequiredMode.REQUIRED)
    private UUID id;

    @NotBlank(message = "Логин не должен быть пустым")
    @Schema(description = "Email")
    private String username;

    @NotBlank(message = "Пароль не должен быть пустым")
    @Schema(description = "Пароль")
    private String password;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX", timezone = "UTC")
    @Schema(description = "Дата окончания подписки")
    private OffsetDateTime subscriptionExpiresAt;

    @Schema(description = "Роль пользователя", requiredMode = Schema.RequiredMode.REQUIRED)
    private List<RoleName> roles;
}
