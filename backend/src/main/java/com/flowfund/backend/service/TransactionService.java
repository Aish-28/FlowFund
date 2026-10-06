package com.flowfund.backend.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import com.flowfund.backend.entity.Transaction;

public interface TransactionService {

    List<Transaction> getTransactionByUserId(UUID userId);

    Transaction transferMoney(UUID senderId, UUID receiverId, BigDecimal amount);
}