package com.flowfund.backend.service.impl;

import com.flowfund.backend.repository.UserRepository;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.flowfund.backend.dto.AdminUserResponse;
import com.flowfund.backend.entity.User;
import com.flowfund.backend.enums.UserStatus;
import com.flowfund.backend.service.AdminUserService;

@Service 
public class AdminUserServiceImpl implements AdminUserService{

    private final UserRepository userRepository;

    AdminUserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public List<AdminUserResponse> getAllUsers() {

        return userRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(user -> new AdminUserResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getPhNo(),
                        user.getRole(),
                        user.getStatus(),
                        user.getCreatedAt()
                ))
                .toList();
    }

    @Override
    public AdminUserResponse updateUserStatus(UUID userId, String status) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        try {
            UserStatus newStatus = UserStatus.valueOf(status.toUpperCase());
            user.setStatus(newStatus);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException(
                    "Invalid user status. Use ACTIVE or BLOCKED");
        }

        User updatedUser = userRepository.save(user);

        return new AdminUserResponse(
                updatedUser.getId(),
                updatedUser.getName(),
                updatedUser.getEmail(),
                updatedUser.getPhNo(),
                updatedUser.getRole(),
                updatedUser.getStatus(),
                updatedUser.getCreatedAt()
        );
    }
    
}
