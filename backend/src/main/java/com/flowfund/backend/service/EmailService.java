package com.flowfund.backend.service;

import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service 
public class EmailService {

    @Autowired 
    private JavaMailSender mailSender;

    public void sendPaymentSuccessEmail(
            String to,
            String recipientName,
            String otherPartyName,
            BigDecimal amount,
            String role) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(to);
        message.setSubject("FlowFund - Payment Successful");

        if ("CLIENT".equals(role)) {
            message.setText(
                    "Hello " + recipientName + ",\n\n" +
                    "Your payment of ₹" + amount +
                    " to " + otherPartyName +
                    " was successful.\n\n" +
                    "Thank you for using FlowFund."
            );
        } else {
            message.setText(
                    "Hello " + recipientName + ",\n\n" +
                    "You have received a payment of ₹" + amount +
                    " from " + otherPartyName +
                    ".\n\n" +
                    "Thank you for using FlowFund."
            );
        }

        mailSender.send(message);
    }
    
}
