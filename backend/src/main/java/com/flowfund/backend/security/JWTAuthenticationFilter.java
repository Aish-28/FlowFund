package com.flowfund.backend.security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.flowfund.backend.entity.Admin;
import com.flowfund.backend.entity.User;
import com.flowfund.backend.repository.AdminRepository;
import com.flowfund.backend.repository.UserRepository;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JWTAuthenticationFilter extends OncePerRequestFilter {

    private final JWTService jwtService;
    private final UserRepository userRepository;
    private final AdminRepository adminRepository;

    public JWTAuthenticationFilter(
            JWTService jwtService,
            UserRepository userRepository,
            AdminRepository adminRepository) {

        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.adminRepository = adminRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String token = authHeader.substring(7);

        try {

            final String email = jwtService.extractUsername(token);

            final Claims claims = jwtService.extractClaim(token, claimsData -> claimsData);

            final String role = claims.get("role", String.class);

            if (email != null
                    && role != null
                    && SecurityContextHolder.getContext().getAuthentication() == null) {

                if ("ADMIN".equals(role)) {

                    Admin admin = adminRepository.findByEmail(email).orElse(null);

                    if (admin != null
                            && jwtService.isTokenValid(token, admin.getEmail())) {

                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(
                                        admin,
                                        null,
                                        java.util.List.of(
                                                new SimpleGrantedAuthority("ROLE_ADMIN")
                                        )
                                );

                        authentication.setDetails(
                                new WebAuthenticationDetailsSource()
                                        .buildDetails(request)
                        );

                        SecurityContextHolder
                                .getContext()
                                .setAuthentication(authentication);
                    }

                } else {

                    User user = userRepository.findByEmail(email).orElse(null);

                    if (user != null
                            && jwtService.isTokenValid(token, user.getEmail())) {

                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(
                                        user,
                                        null,
                                        java.util.List.of(
                                                new SimpleGrantedAuthority(
                                                        "ROLE_" + user.getRole().name()
                                                )
                                        )
                                );

                        authentication.setDetails(
                                new WebAuthenticationDetailsSource()
                                        .buildDetails(request)
                        );

                        SecurityContextHolder
                                .getContext()
                                .setAuthentication(authentication);
                    }
                }
            }

        } catch (Exception e) {
            // Invalid or expired JWT
        }

        filterChain.doFilter(request, response);
    }
}