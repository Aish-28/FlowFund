package com.flowfund.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

import com.flowfund.backend.enums.PaymentStatus;

public class AdminPaymentResponse {
    private UUID id;
    private String clientName;
    private String clientEmail;
    private String freelancerName;
    private String freelancerEmail;
    private BigDecimal amount;
    private LocalDate date;
    private LocalTime time;
    private PaymentStatus status;
    
    public AdminPaymentResponse() {
    }

    public AdminPaymentResponse(UUID id, String clientName, String clientEmail, String freelancerName,
            String freelancerEmail, BigDecimal amount, LocalDate date, LocalTime time, PaymentStatus status) {
        this.id = id;
        this.clientName = clientName;
        this.clientEmail = clientEmail;
        this.freelancerName = freelancerName;
        this.freelancerEmail = freelancerEmail;
        this.amount = amount;
        this.date = date;
        this.time = time;
        this.status = status;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public String getClientEmail() {
        return clientEmail;
    }

    public void setClientEmail(String clientEmail) {
        this.clientEmail = clientEmail;
    }

    public String getFreelancerName() {
        return freelancerName;
    }

    public void setFreelancerName(String freelancerName) {
        this.freelancerName = freelancerName;
    }

    public String getFreelancerEmail() {
        return freelancerEmail;
    }

    public void setFreelancerEmail(String freelancerEmail) {
        this.freelancerEmail = freelancerEmail;
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

    public PaymentStatus getStatus() {
        return status;
    }

    public void setStatus(PaymentStatus status) {
        this.status = status;
    }

}
