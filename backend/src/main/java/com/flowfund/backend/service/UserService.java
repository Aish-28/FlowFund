package com.flowfund.backend.service;

import com.flowfund.backend.dto.AuthResponse;
import com.flowfund.backend.dto.UserLoginRequest;
import com.flowfund.backend.dto.UserRegistrationRequest;

public interface UserService {
    
    AuthResponse registerUser(UserRegistrationRequest request);
    AuthResponse loginUser(UserLoginRequest request);
}
