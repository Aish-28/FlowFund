package com.flowfund.backend.service.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.flowfund.backend.entity.Transaction;
import com.flowfund.backend.repository.TransactionRepository;
import com.flowfund.backend.service.TransactionService;

@Service 
public class TransactionServiceImpl implements TransactionService{

    private final TransactionRepository transactionRepository;

    public TransactionServiceImpl(TransactionRepository transactionRepository){
        this.transactionRepository=transactionRepository;
    }

	@Override
	public List<Transaction> getTransactionByUserId(UUID userId) {
		return transactionRepository.findByWallet_User_IdOrderByDateDescTimeDesc(userId);
	}
    
}
