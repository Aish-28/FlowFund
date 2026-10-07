package com.flowfund.backend.service;

import java.util.List;
import java.util.UUID;

import com.flowfund.backend.dto.AdminUserResponse;
// import com.flowfund.backend.entity.User;

public interface AdminUserService {

    List<AdminUserResponse> getAllUsers();

    AdminUserResponse updateUserStatus(UUID userId, String status);
}