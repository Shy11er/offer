package net.shyller.offer.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Описывает ошибки при нарушении работы с полями")
public class ValidationErrorResponseDto implements Serializable {
    @Schema(description = "Список ошибок")
    private List<Violation> violations;
}
