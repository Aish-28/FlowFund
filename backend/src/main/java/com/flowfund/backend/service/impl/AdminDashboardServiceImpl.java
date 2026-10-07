package com.flowfund.backend.service.impl;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;

import com.flowfund.backend.enums.UserRoles;
import com.flowfund.backend.repository.PaymentRepository;
import com.flowfund.backend.repository.TransactionRepository;
import com.flowfund.backend.repository.UserRepository;
import com.flowfund.backend.service.AdminDashboardService;

@Service 
public class AdminDashboardServiceImpl implements AdminDashboardService{
    
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    private final TransactionRepository transactionRepository;
    
    public AdminDashboardServiceImpl(UserRepository userRepository, PaymentRepository paymentRepository,
            TransactionRepository transactionRepository) {
        this.userRepository = userRepository;
        this.paymentRepository = paymentRepository;
        this.transactionRepository = transactionRepository;
    }

    @Override
    public long getTotalUsers() {
        return userRepository.count();
    }

    @Override
    public long getTotalClients() {
        return userRepository.countByRole(UserRoles.CLIENT);
    }

    @Override
    public long getTotalFreelancers() {
        return userRepository.countByRole(UserRoles.FREELANCER);
    }

    @Override
    public long getTotalPayments() {
        return paymentRepository.count();
    }

    @Override
    public BigDecimal getTotalPaymentAmount() {
        return paymentRepository.findAll()
                .stream()
                .map(payment -> payment.getAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Override
    public long getTotalTransactions() {
        return transactionRepository.count();
    }
    
}
