package com.flowfund.backend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.flowfund.backend.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    List<Payment> findByClient_IdOrderByDateDescTimeDesc(UUID clientId);

    List<Payment> findByFreelancer_IdOrderByDateDescTimeDesc(UUID freelancerId);
}
