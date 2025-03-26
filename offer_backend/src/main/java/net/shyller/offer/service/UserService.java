package net.shyller.offer.service;

import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Collectors;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import net.shyller.offer.common.RoleName;
import net.shyller.offer.db.domain.User;
import net.shyller.offer.db.repository.UserRepository;
import net.shyller.offer.dto.UserDto;
import net.shyller.offer.dto.in.UserInDto;
import net.shyller.offer.exception.AlreadyExistsException;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final CustomUserDetailsService customUserDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper mapper;
    private final AesEncryptionService aesEncryptionService;
    private final RoleService roleService;

    public List<UserDto> getAll() {
        User currentUser = customUserDetailsService.getCurrentUser();
        boolean isAdmin = customUserDetailsService.isAdmin(currentUser);

        return userRepository.findAll()
                .stream()
                .filter(user -> !user.getId().equals(currentUser.getId()))
                .peek(this::refreshSubscription)
                .map(user -> {
                    UserDto dto = mapper.map(user, UserDto.class);
                    dto.setPassword(isAdmin ? aesEncryptionService.decrypt(user.getEncryptedPassword()) : null);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public UserDto create(UserInDto inDto) {
        Optional<User> optionalUser = userRepository.findByUsername(inDto.getUsername());

        if (optionalUser.isPresent()) {
            throw new AlreadyExistsException(String.format("Пользователь с именем %s уже существует", inDto.getUsername()));
        }

        User user = mapper.map(inDto, User.class);
        user.setEncryptedPassword(aesEncryptionService.encrypt(user.getPassword()));
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        OffsetDateTime subscriptionDate = inDto.getSubscriptionExpiresAt();
        user.setRoles(Set.of(roleService.getByName(RoleName.ROLE_PAID_USER)));
        user.setSubscriptionExpiresAt(Objects.requireNonNullElseGet(subscriptionDate, OffsetDateTime::now).plusDays(3));

        return mapper.map(userRepository.save(user), UserDto.class);
    }

    @Transactional
    public UserDto update(UUID id, UserInDto inDto) {
        User user = getById(id);

        mapper.map(inDto, user);
        user.setEncryptedPassword(aesEncryptionService.encrypt(user.getPassword()));
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        if (inDto.getSubscriptionExpiresAt() == null) {
            user.getRoles().removeIf(role -> role.getName().equals(RoleName.ROLE_PAID_USER));
            user.setSubscriptionExpiresAt(null);
        }

        return mapper.map(userRepository.save(user), UserDto.class);
    }

    @Transactional
    public void delete(UUID id) {
        User userEntity = getById(id);
        userRepository.delete(userEntity);
    }

    public UserDto getCurrentUser() {
        User user = customUserDetailsService.getCurrentUser();
        refreshSubscription(user);

        UserDto dto = mapper.map(user, UserDto.class);
        dto.setPassword(null);
        return dto;
    }


    private User getById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(String.format("Пользователь с id %s не найден", id)));
    }

    private void refreshSubscription(User user) {
        OffsetDateTime now = OffsetDateTime.now();

        boolean hasValidSubscription = user.getSubscriptionExpiresAt() != null
                && user.getSubscriptionExpiresAt().isAfter(now);

        boolean hasPaidRole = user.getRoles().stream()
                .anyMatch(role -> role.getName().equals(RoleName.ROLE_PAID_USER));

        if (hasValidSubscription && !hasPaidRole) {
            user.getRoles().add(roleService.getByName(RoleName.ROLE_PAID_USER));
            userRepository.save(user);
            return;
        }

        if (!hasValidSubscription && hasPaidRole) {
            user.getRoles().removeIf(role -> role.getName().equals(RoleName.ROLE_PAID_USER));
            user.setSubscriptionExpiresAt(null);
            userRepository.save(user);
        }
    }

}
