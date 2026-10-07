package com.flowfund.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.flowfund.backend.dto.AdminPaymentResponse;
import com.flowfund.backend.dto.AdminTransactionResponse;
import com.flowfund.backend.service.AdminTransactionService;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminTransactionController {

    private final AdminTransactionService adminTransactionService;

    public AdminTransactionController(
            AdminTransactionService adminTransactionService) {
        this.adminTransactionService = adminTransactionService;
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<AdminTransactionResponse>> getAllTransactions() {
        return ResponseEntity.ok(
                adminTransactionService.getAllTransactions()
        );
    }

    @GetMapping("/payments")
    public ResponseEntity<List<AdminPaymentResponse>> getAllPayments() {
        return ResponseEntity.ok(
                adminTransactionService.getAllPayments()
        );
    }
}