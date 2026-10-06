package com.flowfund.backend.service;

import java.util.List;
import java.util.UUID;

import com.flowfund.backend.entity.Payment;

public interface PaymentService {
    Payment createPayment(UUID clientId, UUID freelancerId, Payment payment);

    List<Payment> getPaymentsByClientId(UUID clientId);

    List<Payment> getPaymentsByFreelancerId(UUID freelancerId);
}