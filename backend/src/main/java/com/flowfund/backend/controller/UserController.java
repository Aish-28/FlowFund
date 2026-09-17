package com.flowfund.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.flowfund.backend.dto.AuthResponse;
import com.flowfund.backend.dto.UserLoginRequest;
import com.flowfund.backend.dto.UserRegistrationRequest;
import com.flowfund.backend.service.UserService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
    
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registerUser(@Valid @RequestBody UserRegistrationRequest request) {
        
        AuthResponse response=userService.registerUser(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
        
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginUser(@RequestBody UserLoginRequest request){
        AuthResponse response=userService.loginUser(request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
}
