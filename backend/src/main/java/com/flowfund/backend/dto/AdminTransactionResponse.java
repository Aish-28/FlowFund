package com.flowfund.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

import com.flowfund.backend.enums.TransactionType;

public class AdminTransactionResponse {
    private UUID id;
    private String userName;
    private String userEmail;
    private TransactionType type;
    private BigDecimal amount;
    private LocalDate date;
    private LocalTime time;
    private String remarks;
    private UUID paymentId;
    
    public AdminTransactionResponse() {
    }

    public AdminTransactionResponse(UUID id, String userName, String userEmail, TransactionType type, BigDecimal amount,
            LocalDate date, LocalTime time, String remarks, UUID paymentId) {
        this.id = id;
        this.userName = userName;
        this.userEmail = userEmail;
        this.type = type;
        this.amount = amount;
        this.date = date;
        this.time = time;
        this.remarks = remarks;
        this.paymentId = paymentId;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public TransactionType getType() {
        return type;
    }

    public void setType(TransactionType type) {
        this.type = type;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalTime getTime() {
        return time;
    }

    public void setTime(LocalTime time) {
        this.time = time;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public UUID getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(UUID paymentId) {
        this.paymentId = paymentId;
    }

}