package com.flowfund.backend.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import com.flowfund.backend.enums.UserRoles;
import com.flowfund.backend.enums.UserStatus;

public class AdminUserResponse {
    
    private UUID id;
    private String name;
    private String email;
    private String phNo;
    private UserRoles role;
    private UserStatus status;
    private LocalDateTime createdAt;
    
    public AdminUserResponse(UUID id, String name, String email, String phNo, UserRoles role, UserStatus status,
            LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phNo = phNo;
        this.role = role;
        this.status = status;
        this.createdAt = createdAt;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhNo() {
        return phNo;
    }

    public void setPhNo(String phNo) {
        this.phNo = phNo;
    }

    public UserRoles getRole() {
        return role;
    }

    public void setRole(UserRoles role) {
        this.role = role;
    }

    public UserStatus getStatus() {
        return status;
    }

    public void setStatus(UserStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

}
