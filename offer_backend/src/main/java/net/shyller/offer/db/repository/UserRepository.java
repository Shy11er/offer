package net.shyller.offer.db.repository;

import java.util.Optional;
import java.util.UUID;
import net.shyller.offer.db.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByUsername(String username);
}
