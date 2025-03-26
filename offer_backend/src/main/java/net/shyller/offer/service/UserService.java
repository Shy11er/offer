package net.shyller.offer.service;

import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Collectors;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
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

    public List<UserDto> getAll() {
        User currentUser = customUserDetailsService.getCurrentUser();
        boolean isAdmin = customUserDetailsService.isAdmin(currentUser);

        return userRepository.findAll()
                .stream()
                .filter(user -> !user.getId().equals(currentUser.getId()))
                .map(user -> {
                    UserDto dto = mapper.map(user, UserDto.class);
                    if (!isAdmin) {
                        dto.setPassword(null);
                    } else {
                        dto.setPassword(aesEncryptionService.decrypt(user.getEncryptedPassword()));
                    }
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
        user.setSubscriptionExpiresAt(inDto.getSubscriptionExpiresAt().plusDays(3));
        return mapper.map(userRepository.save(user), UserDto.class);
    }

    @Transactional
    public UserDto update(UUID id, UserInDto inDto) {
        User user = getUserById(id);

        mapper.map(inDto, user);
        user.setEncryptedPassword(aesEncryptionService.encrypt(user.getPassword()));
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return mapper.map(userRepository.save(user), UserDto.class);
    }

    @Transactional
    public void delete(UUID id) {
        User userEntity = getUserById(id);
        userRepository.delete(userEntity);
    }

    public User getUserById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(String.format("Пользователь с id %s не найден", id)));
    }

    public UserDto getCurrentUser() {
        User user = customUserDetailsService.getCurrentUser();
        UserDto dto = mapper.map(user, UserDto.class);
        dto.setPassword(null);
        return dto;
    }
}
