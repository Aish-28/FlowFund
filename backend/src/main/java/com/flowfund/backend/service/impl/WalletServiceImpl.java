package com.flowfund.backend.service.impl;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.flowfund.backend.entity.Wallet;
import com.flowfund.backend.repository.WalletRepository;
import com.flowfund.backend.service.WalletService;

@Service 
public class WalletServiceImpl implements WalletService{

    private final WalletRepository walletRepository;
    
    public WalletServiceImpl(WalletRepository walletRepository) {
        this.walletRepository = walletRepository;
    }

    @Override
    public Wallet getWalletByUserId(UUID userId) {
        
        return walletRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));
    }
    
}
