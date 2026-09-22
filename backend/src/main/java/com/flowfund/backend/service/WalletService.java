package com.flowfund.backend.service;

import java.util.UUID;

import com.flowfund.backend.entity.Wallet;

public interface WalletService {
    Wallet getWalletByUserId(UUID userId);
}
