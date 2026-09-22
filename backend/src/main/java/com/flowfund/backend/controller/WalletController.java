package com.flowfund.backend.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.flowfund.backend.entity.Wallet;
import com.flowfund.backend.service.WalletService;

@RestController 
@RequestMapping ("api/wallets")
public class WalletController {
    
    private final WalletService walletService;

    public WalletController(WalletService walletService){
        this.walletService=walletService;
    }

    @GetMapping ("/user/{userId}")
    public ResponseEntity<Wallet> getWalletByUserId(@PathVariable UUID userId){
        return ResponseEntity.ok(walletService.getWalletByUserId(userId));
    }
}
