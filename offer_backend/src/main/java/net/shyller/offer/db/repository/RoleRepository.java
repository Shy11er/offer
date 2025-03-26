package net.shyller.offer.db.repository;

import java.util.Optional;
import java.util.UUID;

import net.shyller.offer.common.RoleName;
import net.shyller.offer.db.domain.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, UUID> {
    Optional<Role> findByName(RoleName name);
}
