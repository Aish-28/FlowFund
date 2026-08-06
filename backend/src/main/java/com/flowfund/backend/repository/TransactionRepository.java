package com.flowfund.backend.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.flowfund.backend.entity.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
    
}
