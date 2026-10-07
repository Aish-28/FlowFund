package com.flowfund.backend.service;

import java.util.List;

import com.flowfund.backend.dto.AdminPaymentResponse;
import com.flowfund.backend.dto.AdminTransactionResponse;

public interface AdminTransactionService {

    List<AdminTransactionResponse> getAllTransactions();

    List<AdminPaymentResponse> getAllPayments();
}