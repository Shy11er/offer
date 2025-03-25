package net.shyller.offer.db.domain;

import jakarta.persistence.*;
import lombok.*;
import net.shyller.offer.common.RoleName;

import java.util.UUID;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "role")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(name="name", nullable = false, unique = true)
    private RoleName name;
}
