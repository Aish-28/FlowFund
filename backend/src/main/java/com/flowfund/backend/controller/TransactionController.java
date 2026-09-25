package com.flowfund.backend.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.flowfund.backend.entity.Transaction;
import com.flowfund.backend.service.TransactionService;

@RestController 
@RequestMapping ("/api/transactions")
public class TransactionController {
    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService){
        this.transactionService=transactionService;
    }

    @GetMapping ("/user/{userId}")
    public ResponseEntity<List<Transaction>> getTransactionByUserId(@PathVariable UUID userId){
        return ResponseEntity.ok(transactionService.getTransactionByUserId(userId));
    }
}
