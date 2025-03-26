package net.shyller.offer.config;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import net.shyller.offer.common.RoleName;
import net.shyller.offer.db.domain.Role;
import net.shyller.offer.db.domain.User;
import net.shyller.offer.db.repository.RoleRepository;
import net.shyller.offer.db.repository.UserRepository;
import net.shyller.offer.service.AesEncryptionService;
import net.shyller.offer.service.RoleService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;


@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AesEncryptionService aesEncryptionService;
    private final RoleService roleService;

    @Value("${spring.security.user.password}")
    private String password;

    @Override
    @Transactional
    public void run(String... args) {
        Role adminRole = roleService.getByName(RoleName.ROLE_ADMIN);
        Set<Role> roles = new HashSet<>();
        roles.add(adminRole);

        userRepository.findByUsername("admin").orElseGet(() -> {
            User user = new User();
            user.setUsername("admin");
            user.setPassword(passwordEncoder.encode(password));
            user.setEncryptedPassword(aesEncryptionService.encrypt(password));
            user.setRoles(roles);
            return userRepository.save(user);
        });
    }
}
