package net.shyller.offer.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class PaymentRequest {
    private double amount;
    private UUID userId;
    private String email;
}