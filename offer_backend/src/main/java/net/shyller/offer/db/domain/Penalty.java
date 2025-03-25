package net.shyller.offer.db.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

/**
 * Сущность для представления штрафов, которые могут быть применены в рамках договора.
 */
@Getter
@Setter
@Entity
@Table(name = "penalty")
public class Penalty {

    /**
     * Уникальный идентификатор штрафа.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /**
     * Причина штрафа (например, нарушение условий договора).
     */
    @Column(name = "reason")
    private String reason;

    /**
     * Сумма штрафа.
     */
    @Column(name = "amount")
    private Double amount;

    /**
     * Связь с договором, к которому относится штраф.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_id", referencedColumnName = "id")
    private Contract contract;
}
