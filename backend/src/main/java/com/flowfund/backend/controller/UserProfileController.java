package com.flowfund.backend.controller;

import com.flowfund.backend.dto.UserProfileUpdateRequest;
import com.flowfund.backend.entity.User;
import com.flowfund.backend.repository.UserRepository;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/users/profile")
public class UserProfileController {

    private final UserRepository userRepository;

    public UserProfileController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public User getMyProfile() {
        return getAuthenticatedUser();
    }

    @PutMapping
    public User updateMyProfile(
            @Valid @RequestBody UserProfileUpdateRequest request) {

        User user = getAuthenticatedUser();

        if (userRepository.existsByPhNoAndIdNot(
                request.getPhNo(), user.getId())) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "This phone number is already registered"
            );
        }

        user.setName(request.getName().trim());
        user.setPhNo(request.getPhNo());

        return userRepository.save(user);
    }

    private User getAuthenticatedUser() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication.getName() == null
                || authentication.getName().equals("anonymousUser")) {
            throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Please log in to access your profile"
            );
        }

        if (authentication.getPrincipal() instanceof User user) {
                return user;
            }

            return userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User profile not found"
                    ));
    }
}