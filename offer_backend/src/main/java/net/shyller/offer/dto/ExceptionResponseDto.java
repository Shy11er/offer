package net.shyller.offer.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Описывает возвращаемый результат если получена ошибка")
public class ExceptionResponseDto implements Serializable {
    @Schema(description = "Текст ошибки")
    private String message;
}
