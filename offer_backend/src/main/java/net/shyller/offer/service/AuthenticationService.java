package net.shyller.offer.service;


import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;
import net.shyller.offer.dto.in.SignInRequestDto;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private static final String JWT_TOKEN_COOKIE_NAME = "jwt-token";
    private final CustomUserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;


    /**
     * Аутентификация пользователя
     *
     * @param request данные пользователя (логин/пароль)
     * */
    public void authenticate(HttpServletResponse response, SignInRequestDto request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                request.getUsername(),
                request.getPassword()
        ));
        var user = userDetailsService.loadUserByUsername(request.getUsername());

        setCookie(response, user);
    }

    private void setCookie(HttpServletResponse response, UserDetails user) {
        Cookie cookie = new Cookie(JWT_TOKEN_COOKIE_NAME, jwtService.generateToken(user));
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        response.addCookie(cookie);
    }

    public void logout(HttpServletResponse response) {
        Cookie cookie = new Cookie(JWT_TOKEN_COOKIE_NAME, "");
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }
}
