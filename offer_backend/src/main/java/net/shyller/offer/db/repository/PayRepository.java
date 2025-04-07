package net.shyller.offer.db.repository;

import net.shyller.offer.db.domain.Pay;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PayRepository extends JpaRepository<Pay, UUID> {
    Optional<Pay> findFirstByUserIdOrderByIdDesc(UUID userId);

    Optional<Pay> findFirstByOrderId(String orderId);
}
