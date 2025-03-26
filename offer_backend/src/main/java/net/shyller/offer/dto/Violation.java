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
@Schema(description = "Описывает ошибку с указанием поля и текста ошибки")
public class Violation implements Serializable {
    @Schema(description = "Ошибочное поле")
    private String fieldName;

    @Schema(description = "Описание ошибки")
    private String message;
}
