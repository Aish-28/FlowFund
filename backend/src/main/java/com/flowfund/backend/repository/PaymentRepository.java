package com.flowfund.backend.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.flowfund.backend.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    
}
