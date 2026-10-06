package com.flowfund.backend.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.flowfund.backend.entity.Payout;
import com.flowfund.backend.service.PayoutService;

@RestController
@RequestMapping("/api/payouts")
public class PayoutController {

    private final PayoutService payoutService;

    public PayoutController(PayoutService payoutService) {
        this.payoutService = payoutService;
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<Payout> createMonthlyPayout(
            @PathVariable UUID userId) {

        return ResponseEntity.ok(
                payoutService.createMonthlyPayout(userId)
        );
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Payout>> getPayouts(
            @PathVariable UUID userId) {

        return ResponseEntity.ok(
                payoutService.getPayoutsByUserId(userId)
        );
    }
}