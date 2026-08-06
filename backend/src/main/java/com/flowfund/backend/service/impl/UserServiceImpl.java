package com.flowfund.backend.service.impl;

import java.math.BigDecimal;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.flowfund.backend.dto.AuthResponse;
import com.flowfund.backend.dto.UserLoginRequest;
import com.flowfund.backend.dto.UserRegistrationRequest;
import com.flowfund.backend.entity.User;
import com.flowfund.backend.entity.Wallet;
import com.flowfund.backend.enums.UserStatus;
import com.flowfund.backend.repository.UserRepository;
import com.flowfund.backend.repository.WalletRepository;
import com.flowfund.backend.service.UserService;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, WalletRepository walletRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public AuthResponse registerUser(UserRegistrationRequest request) {

            if(!request.getPassword().equals(request.getConfirmPassword())){
                throw new RuntimeException("Passwords do not match");
            }

            if(userRepository.existsByEmail(request.getEmail())){
                throw new RuntimeException("Email already exists");
            }

            if(userRepository.existsByPhNo(request.getPhNo())){
                throw new RuntimeException("Phno already exists");
            }

            User user=new User();
            user.setName(request.getName());
            user.setEmail(request.getEmail());
            user.setPhNo(request.getPhNo());
            user.setRole(request.getRole());
            user.setStatus(UserStatus.ACTIVE);
            user.setPassword(passwordEncoder.encode(request.getPassword()));

            User savedUser=userRepository.save(user);

            Wallet wallet=new Wallet();
            wallet.setUser(savedUser);
            wallet.setBalance(BigDecimal.ZERO);
            wallet.setReserveBalance(BigDecimal.ZERO);
            wallet.setStatus(UserStatus.ACTIVE);

            walletRepository.save(wallet);

            AuthResponse response=new AuthResponse();
            response.setMessage("Registration succesful");
            response.setUserId(savedUser.getId());
            response.setName(savedUser.getName());
            response.setRole(savedUser.getRole().name());

            return response;
    }

    @Override
    public AuthResponse loginUser(UserLoginRequest request) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'loginUser'");
    }
    
}
