package net.shyller.offer.db.domain;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import lombok.*;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "pay")
public class Pay {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "last_pay_date")
    private OffsetDateTime lastPayDate;

    @Column(name = "paid_until")
    private OffsetDateTime paidUntil;

    @Column(name = "payment_id")
    private String paymentId;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "rebill_id")
    private String rebillId;

    @Column(name = "pan")
    private String pan;

    @Column(name = "card_id")
    private String cardId;

    @Column(name = "order_id")
    private String orderId;

    @Column(name = "timestamp")
    private OffsetDateTime timestamp;
}
