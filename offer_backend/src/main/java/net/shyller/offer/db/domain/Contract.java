package net.shyller.offer.db.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "contract")
public class Contract {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(optional = false)
    @JoinColumn(name = "object_id", nullable = false, unique = true)
    private Object object;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "passport_series", nullable = false)
    private String passportSeries;

    @Column(name = "passport_number", nullable = false)
    private String passportNumber;

    @Column(name = "address", nullable = false)
    private String address;

    @Column(name = "phone", nullable = false)
    private String phone;

    @Column(name = "signed_at", nullable = false)
    private OffsetDateTime signedAt;

    @Column(name = "ip_address")
    private String ip;

    @Column(name = "user_agent")
    private String userAgent;
}
