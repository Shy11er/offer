package net.shyller.offer.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * DTO для подписанного контракта
 */
@Getter
@Setter
@Schema(description = "Подписанный договор аренды")
public class ContractDto {

    @Schema(description = "ID контракта")
    private UUID id;

    @NotNull
    @Schema(description = "Объект, к которому относится договор")
    private ObjectDto objectDto;

    @NotNull
    @Schema(description = "ФИО арендующего")
    private String fullName;

    @NotNull
    @Schema(description = "Серия паспорта")
    private String passportSeries;

    @NotNull
    @Schema(description = "Номер паспорта")
    private String passportNumber;

    @NotNull
    @Schema(description = "Адрес регистрации")
    private String address;

    @NotNull
    @Schema(description = "Телефон")
    private String phone;

    @NotNull
    @Schema(description = "Дата и время подписания")
    private OffsetDateTime signedAt;

    @Schema(description = "IP адрес, с которого был подписан договор")
    private String ip;

    @Schema(description = "User-Agent браузера клиента")
    private String userAgent;
}
