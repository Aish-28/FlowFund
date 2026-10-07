package com.flowfund.backend.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.flowfund.backend.dto.AdminUserResponse;
// import com.flowfund.backend.entity.User;
import com.flowfund.backend.service.AdminUserService;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminUserController {

    private final AdminUserService adminUserService;

    public AdminUserController(AdminUserService adminUserService) {
        this.adminUserService = adminUserService;
    }

    @GetMapping
    public ResponseEntity<List<AdminUserResponse>> getAllUsers() {
        return ResponseEntity.ok(adminUserService.getAllUsers());
    }

    @PutMapping("/{userId}/status")
    public ResponseEntity<AdminUserResponse> updateUserStatus(
            @PathVariable UUID userId,
            @RequestParam String status) {

        return ResponseEntity.ok(
                adminUserService.updateUserStatus(userId, status)
        );
    }
}