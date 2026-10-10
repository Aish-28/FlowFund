
package com.flowfund.backend.controller;

import java.math.BigDecimal;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.flowfund.backend.entity.Wallet;
import com.flowfund.backend.service.WalletService;

@RestController
@RequestMapping("/api/wallets")
public class WalletController {

    private final WalletService walletService;

    public WalletController(WalletService walletService) {
        this.walletService = walletService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Wallet> getWalletByUserId(
            @PathVariable UUID userId) {
        return ResponseEntity.ok(walletService.getWalletByUserId(userId));
    }

    @PutMapping("/user/{userId}/reserve")
    public ResponseEntity<Wallet> setReserveBalance(
            @PathVariable UUID userId,
            @RequestParam BigDecimal amount) {
        return ResponseEntity.ok(
                walletService.setReserveBalance(userId, amount));
    }
}
