package net.shyller.offer.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import net.shyller.offer.common.RoleName;
import net.shyller.offer.db.domain.Role;
import net.shyller.offer.db.repository.RoleRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository repository;

    public Role getByName(RoleName name) {
        return repository
            .findByName(name)
            .orElseThrow(() -> new EntityNotFoundException(String.format("Роль %s не найдена", name)));
    }
}
