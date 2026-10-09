
package com.flowfund.backend.service.impl;

import java.util.Locale;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.flowfund.backend.dto.AdminLoginRequest;
import com.flowfund.backend.dto.AdminRegistrationRequest;
import com.flowfund.backend.dto.AuthResponse;
import com.flowfund.backend.entity.Admin;
import com.flowfund.backend.repository.AdminRepository;
import com.flowfund.backend.security.JWTService;
import com.flowfund.backend.service.AdminService;

@Service
public class AdminServiceImpl implements AdminService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTService jwtService;

    public AdminServiceImpl(
            AdminRepository adminRepository,
            PasswordEncoder passwordEncoder,
            JWTService jwtService) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    public AuthResponse loginAdmin(AdminLoginRequest request) {
        Admin admin = adminRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (!passwordEncoder.matches(
                request.getPassword(), admin.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        String token = jwtService.generateToken(admin.getEmail(), "ADMIN");

        AuthResponse loginResponse = new AuthResponse();
        loginResponse.setMessage("Login successful");
        loginResponse.setUserId(admin.getId());
        loginResponse.setName(admin.getName());
        loginResponse.setRole("ADMIN");
        loginResponse.setToken(token);

        return loginResponse;
    }

    @Override
    @Transactional
    public void registerAdmin(AdminRegistrationRequest request) {
        if (request.getName() == null || request.getName().isBlank()) {
            throw new RuntimeException("Admin name is required");
        }

        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new RuntimeException("Admin email is required");
        }

        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new RuntimeException("Admin password is required");
        }

        String name = request.getName().trim();
        String email = request.getEmail().trim().toLowerCase(Locale.ROOT);
        String password = request.getPassword();

        if (password.length() < 8) {
            throw new RuntimeException(
                    "Password must contain at least 8 characters");
        }

        if (adminRepository.existsByEmail(email)) {
            throw new RuntimeException(
                    "An admin with this email already exists");
        }

        Admin admin = new Admin();
        admin.setName(name);
        admin.setEmail(email);
        admin.setPassword(passwordEncoder.encode(password));

        adminRepository.save(admin);
    }
}
