package net.shyller.offer.common;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Schema(enumAsRef = true)
public enum ObjectType {
    TECHNIQUE, // Техника
    APARTMENT, // Недвижимость
    SERVICE; // Услуги
}
