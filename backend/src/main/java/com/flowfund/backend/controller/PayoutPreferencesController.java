package com.flowfund.backend.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.flowfund.backend.entity.PayoutPreferences;
import com.flowfund.backend.service.PayoutPreferencesServices;

@RestController 
@RequestMapping ("/api/payout-preferences")
public class PayoutPreferencesController {
    private final PayoutPreferencesServices payoutPreferencesServices;

    public PayoutPreferencesController(PayoutPreferencesServices payoutPreferencesServices) {
        this.payoutPreferencesServices = payoutPreferencesServices;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<PayoutPreferences> getPreferences(@PathVariable UUID userId) {

        return ResponseEntity.ok(
                payoutPreferencesServices.getPreferencesByUserId(userId)
        );
    }

    @PostMapping ("/user/{userId}")
    public ResponseEntity<PayoutPreferences> createPreferences(
            @PathVariable UUID userId,
            @RequestBody PayoutPreferences preferences) {

        return ResponseEntity.ok(payoutPreferencesServices.createPreferences(userId, preferences));
    } 

    @PutMapping ("/user/{userId}")
    public ResponseEntity<PayoutPreferences> updatePreferences(
            @PathVariable UUID userId,
            @RequestBody PayoutPreferences preferences) {

        return ResponseEntity.ok(
                payoutPreferencesServices.updatePreferences(userId, preferences)
        );
    }

}
