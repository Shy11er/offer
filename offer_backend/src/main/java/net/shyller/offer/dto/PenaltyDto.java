package net.shyller.offer.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

/**
 * DTO для штрафа, связанного с объектом
 */
@Getter
@Setter
@Schema(description = "Сущность штрафа")
public class PenaltyDto {
    @Schema(description = "ID штрафа")
    private UUID id;

    @Schema(description = "Причина штрафа")
    private String reason;

    @Schema(description = "Сумма штрафа")
    private Double amount;

    @Schema(description = "ID объекта, к которому привязан штраф")
    private UUID objectId;
}