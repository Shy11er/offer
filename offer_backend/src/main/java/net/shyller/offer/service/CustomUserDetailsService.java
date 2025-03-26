package net.shyller.offer.service;


import java.security.Principal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import lombok.RequiredArgsConstructor;
import net.shyller.offer.common.RoleName;
import net.shyller.offer.db.domain.Role;
import net.shyller.offer.db.domain.User;
import net.shyller.offer.db.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;
    private final RoleService roleService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(String.format("Пользователь с логином %s не найден", username)));
        Set<Role> roles = user.getRoles();
        boolean hasPaidUserRole = roles.stream().anyMatch(role -> RoleName.ROLE_PAID_USER.name().equals(role.getName()));

        if (hasPaidUserRole
                && (user.getSubscriptionExpiresAt() == null
                || user.getSubscriptionExpiresAt().isBefore(OffsetDateTime.now()))) {
            roles.remove(roleService.getByName(RoleName.ROLE_PAID_USER));

            user.setSubscriptionExpiresAt(null);
            user.setRoles(roles);
            userRepository.save(user);
        }

        List<GrantedAuthority> authorities =
                new ArrayList<>(
                        roles.stream()
                                .map(role -> (GrantedAuthority) new SimpleGrantedAuthority(role.getName().name()))
                                .toList());

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                authorities
        );
    }

    public User getUserFromPrincipal(Principal principal) {
        return userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException(
                        String.format("Пользователь с логином %s не найден", principal.getName())));
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            throw new AuthenticationCredentialsNotFoundException("Пользователь не авторизован");
        }
        return getUserFromPrincipal(authentication);
    }

    public Boolean isAdmin(User currentUser) {
        return currentUser.getRoles().stream().anyMatch(role -> role.getName().equals(RoleName.ROLE_ADMIN));
    }
}
