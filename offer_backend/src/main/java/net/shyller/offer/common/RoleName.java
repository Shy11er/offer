package net.shyller.offer.common;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;

@NoArgsConstructor
@Schema(enumAsRef = true)
public enum RoleName implements GrantedAuthority {
    ROLE_ADMIN,
    ROLE_PAID_USER;

    @Override
    public String getAuthority() {
        return name();
    }
}