
package com.flowfund.backend.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.flowfund.backend.dto.AdminLoginRequest;
import com.flowfund.backend.dto.AdminRegistrationRequest;
import com.flowfund.backend.dto.AuthResponse;
import com.flowfund.backend.service.AdminService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginAdmin(
            @RequestBody AdminLoginRequest request) {

        AuthResponse response = adminService.loginAdmin(request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> registerAdmin(
            @RequestBody AdminRegistrationRequest request) {

        adminService.registerAdmin(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Admin registered successfully"));
    }
}
