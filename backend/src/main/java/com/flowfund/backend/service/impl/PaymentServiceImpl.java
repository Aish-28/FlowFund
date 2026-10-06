package com.flowfund.backend.service.impl;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.flowfund.backend.entity.Payment;
import com.flowfund.backend.entity.User;
import com.flowfund.backend.enums.PaymentStatus;
import com.flowfund.backend.repository.PaymentRepository;
import com.flowfund.backend.repository.UserRepository;
import com.flowfund.backend.service.PaymentService;

@Service 
public class PaymentServiceImpl implements PaymentService{

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;

	public PaymentServiceImpl(PaymentRepository paymentRepository, UserRepository userRepository) {
		this.paymentRepository = paymentRepository;
		this.userRepository = userRepository;
	}

	@Override
	public Payment createPayment(UUID clientId, UUID freelancerId, Payment payment) {
		
		User client=userRepository.findById(clientId)
		.orElseThrow(()->new RuntimeException("Client not found"));

		User freelancer=userRepository.findById(freelancerId)
		.orElseThrow(()->new RuntimeException("Freelancer not found"));

		payment.setClient(client);
		payment.setFreelancer(freelancer);

		payment.setDate(LocalDate.now());
		payment.setTime(LocalTime.now());

		payment.setStatus(PaymentStatus.SUCCESS);

		return paymentRepository.save(payment);
	}

	@Override
	public List<Payment> getPaymentsByClientId(UUID clientId) {
		return paymentRepository.findByClient_IdOrderByDateDescTimeDesc(clientId);
	}

	@Override
	public List<Payment> getPaymentsByFreelancerId(UUID freelancerId) {
		return paymentRepository.findByFreelancer_IdOrderByDateDescTimeDesc(freelancerId);
	}
    
}
