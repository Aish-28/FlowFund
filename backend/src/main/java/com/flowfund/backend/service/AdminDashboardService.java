package com.flowfund.backend.service;

import java.math.BigDecimal;

public interface AdminDashboardService {
    long getTotalUsers();

    long getTotalClients();

    long getTotalFreelancers();

    long getTotalPayments();

    BigDecimal getTotalPaymentAmount();

    long getTotalTransactions();
}
