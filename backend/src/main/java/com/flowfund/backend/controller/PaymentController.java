package com.flowfund.backend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.flowfund.backend.entity.Payment;
import com.flowfund.backend.service.PaymentService;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;



@RestController 
@RequestMapping ("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/client/{clientId}/freelancer/{freelancerId}")
    public ResponseEntity<Payment> createPayment(@PathVariable UUID clientId, @PathVariable UUID freelancerId, @RequestBody Payment payment){
        return ResponseEntity.ok(paymentService.createPayment(clientId, freelancerId, payment));
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<Payment>> getPaymentsByClient(@PathVariable UUID clientId) {
        
        return ResponseEntity.ok(paymentService.getPaymentsByClientId(clientId));
    }
    
    @GetMapping("/freelancer/{freelancerId}")
    public ResponseEntity<List<Payment>> getPaymentsByFreelancer(@PathVariable UUID freelancerId) {
        
        return ResponseEntity.ok(paymentService.getPaymentsByFreelancerId(freelancerId));
    }
}
