package net.shyller.offer.db.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import net.shyller.offer.db.domain.Object;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ObjectRepository extends JpaRepository<Object, UUID> {
    List<Object> findAllByOwnerId(UUID id);
}
