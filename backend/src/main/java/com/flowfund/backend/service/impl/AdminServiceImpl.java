package com.flowfund.backend.service.impl;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.flowfund.backend.dto.AdminLoginRequest;
import com.flowfund.backend.dto.AuthResponse;
import com.flowfund.backend.entity.Admin;
import com.flowfund.backend.repository.AdminRepository;
import com.flowfund.backend.security.JWTService;
import com.flowfund.backend.service.AdminService;

@Service
public class AdminServiceImpl  implements AdminService{

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JWTService jwtService;
 
    public AdminServiceImpl(AdminRepository adminRepository, PasswordEncoder passwordEncoder, JWTService jwtService) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    public AuthResponse loginAdmin(AdminLoginRequest request) {
        Admin admin=adminRepository.findByEmail(request.getEmail())
        .orElseThrow(()->new RuntimeException("Admin not found"));

        if(!passwordEncoder.matches(request.getPassword(), admin.getPassword())){
            throw new RuntimeException("Invalid username or password");
        }

        String token=jwtService.generateToken(admin.getEmail(),"ADMIN");

        AuthResponse logiResponse=new AuthResponse();
        logiResponse.setMessage("Login successful");
        logiResponse.setUserId(admin.getId());
        logiResponse.setName(admin.getName());
        logiResponse.setRole("ADMIN");
        logiResponse.setToken(token);

        return logiResponse;
    }
    
}
