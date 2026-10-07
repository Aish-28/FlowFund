package com.flowfund.backend.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.flowfund.backend.dto.AdminPaymentResponse;
import com.flowfund.backend.dto.AdminTransactionResponse;
import com.flowfund.backend.repository.PaymentRepository;
import com.flowfund.backend.repository.TransactionRepository;
import com.flowfund.backend.service.AdminTransactionService;

@Service
public class AdminTransactionServiceImpl implements AdminTransactionService {

    private final TransactionRepository transactionRepository;
    private final PaymentRepository paymentRepository;

    public AdminTransactionServiceImpl(
            TransactionRepository transactionRepository,
            PaymentRepository paymentRepository) {

        this.transactionRepository = transactionRepository;
        this.paymentRepository = paymentRepository;
    }

    @Override
    public List<AdminTransactionResponse> getAllTransactions() {

        return transactionRepository.findAll()
                .stream()
                .map(transaction -> {

                    String userName = transaction.getWallet()
                            .getUser()
                            .getName();

                    String userEmail = transaction.getWallet()
                            .getUser()
                            .getEmail();

                    return new AdminTransactionResponse(
                            transaction.getId(),
                            userName,
                            userEmail,
                            transaction.getType(),
                            transaction.getAmount(),
                            transaction.getDate(),
                            transaction.getTime(),
                            transaction.getRemarks(),
                            transaction.getPayment() != null
                                    ? transaction.getPayment().getId()
                                    : null
                    );
                })
                .toList();
    }

    @Override
    public List<AdminPaymentResponse> getAllPayments() {

        return paymentRepository.findAll()
                .stream()
                .map(payment -> new AdminPaymentResponse(
                        payment.getId(),
                        payment.getClient().getName(),
                        payment.getClient().getEmail(),
                        payment.getFreelancer().getName(),
                        payment.getFreelancer().getEmail(),
                        payment.getAmount(),
                        payment.getDate(),
                        payment.getTime(),
                        payment.getStatus()
                ))
                .toList();
    }
}