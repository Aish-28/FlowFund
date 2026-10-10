
package com.flowfund.backend.service;

import java.math.BigDecimal;
import java.util.UUID;

import com.flowfund.backend.entity.Wallet;

public interface WalletService {

    Wallet getWalletByUserId(UUID userId);

    Wallet setReserveBalance(UUID userId, BigDecimal reserveAmount);
}
