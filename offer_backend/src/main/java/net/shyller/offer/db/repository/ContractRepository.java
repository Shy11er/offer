package net.shyller.offer.db.repository;

import java.util.List;
import java.util.UUID;

import jakarta.persistence.Entity;
import net.shyller.offer.db.domain.Contract;
import net.shyller.offer.db.domain.Object;
import net.shyller.offer.db.domain.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContractRepository extends JpaRepository<Contract, UUID> {
    @EntityGraph(attributePaths = {"object", "object.owner"})
    List<Contract> findAllByObjectOwner(User owner);
}
