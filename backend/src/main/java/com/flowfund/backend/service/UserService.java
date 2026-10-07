package com.flowfund.backend.service;

import java.util.List;
import java.util.UUID;

import com.flowfund.backend.dto.AuthResponse;
import com.flowfund.backend.dto.UserLoginRequest;
import com.flowfund.backend.dto.UserRegistrationRequest;
import com.flowfund.backend.entity.User;

public interface UserService {

    AuthResponse registerUser(UserRegistrationRequest request);

    AuthResponse loginUser(UserLoginRequest request);

    List<User> getAllUsers();

    User updateUserStatus(UUID userId, String status);
}