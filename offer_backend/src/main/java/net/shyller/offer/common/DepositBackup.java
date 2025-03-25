package net.shyller.offer.common;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Schema(enumAsRef = true)
public enum DepositBackup {
    CARD, // Вернется на карту
    CASH; // Вернется наличными
}
