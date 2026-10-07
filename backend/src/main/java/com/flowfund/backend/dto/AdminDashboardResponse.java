package com.flowfund.backend.dto;

import java.math.BigDecimal;

public class AdminDashboardResponse {
    private long totalUsers;
    private long totalClients;
    private long totalFreelancers;
    private long totalPayments;
    private BigDecimal totalPaymentAmount;
    private long totalTransactions;
    
    public AdminDashboardResponse(long totalUsers, long totalClients, long totalFreelancers, long totalPayments,
            BigDecimal totalPaymentAmount, long totalTransactions) {
        this.totalUsers = totalUsers;
        this.totalClients = totalClients;
        this.totalFreelancers = totalFreelancers;
        this.totalPayments = totalPayments;
        this.totalPaymentAmount = totalPaymentAmount;
        this.totalTransactions = totalTransactions;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalClients() {
        return totalClients;
    }

    public void setTotalClients(long totalClients) {
        this.totalClients = totalClients;
    }

    public long getTotalFreelancers() {
        return totalFreelancers;
    }

    public void setTotalFreelancers(long totalFreelancers) {
        this.totalFreelancers = totalFreelancers;
    }

    public long getTotalPayments() {
        return totalPayments;
    }

    public void setTotalPayments(long totalPayments) {
        this.totalPayments = totalPayments;
    }

    public BigDecimal getTotalPaymentAmount() {
        return totalPaymentAmount;
    }

    public void setTotalPaymentAmount(BigDecimal totalPaymentAmount) {
        this.totalPaymentAmount = totalPaymentAmount;
    }

    public long getTotalTransactions() {
        return totalTransactions;
    }

    public void setTotalTransactions(long totalTransactions) {
        this.totalTransactions = totalTransactions;
    }

}
