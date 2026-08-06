package com.flowfund.backend.service;

import com.flowfund.backend.dto.AdminLoginRequest;
import com.flowfund.backend.dto.AuthResponse;

public interface AdminService {
    
    AuthResponse loginAdmin(AdminLoginRequest request);
}
