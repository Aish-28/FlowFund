
package com.flowfund.backend.service.impl;

import java.math.BigDecimal;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.flowfund.backend.entity.Wallet;
import com.flowfund.backend.repository.WalletRepository;
import com.flowfund.backend.service.WalletService;

@Service
public class WalletServiceImpl implements WalletService {

    private final WalletRepository walletRepository;

    public WalletServiceImpl(WalletRepository walletRepository) {
        this.walletRepository = walletRepository;
    }

    @Override
    public Wallet getWalletByUserId(UUID userId) {
        return walletRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));
    }

    @Override
    @Transactional
    public Wallet setReserveBalance(UUID userId, BigDecimal reserveAmount) {

        if (reserveAmount == null
                || reserveAmount.compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException(
                    "Reserve amount cannot be negative or empty");
        }

        Wallet wallet = walletRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));

        BigDecimal balance = wallet.getBalance() == null
                ? BigDecimal.ZERO : wallet.getBalance();

        BigDecimal currentReserve = wallet.getReserveBalance() == null
                ? BigDecimal.ZERO : wallet.getReserveBalance();

        // Total funds remain unchanged when money is moved into or out of reserve.
        BigDecimal totalFunds = balance.add(currentReserve);

        if (reserveAmount.compareTo(totalFunds) > 0) {
            throw new RuntimeException(
                    "Reserve amount cannot exceed your total wallet funds");
        }

        BigDecimal newBalance = totalFunds.subtract(reserveAmount);

        wallet.setBalance(newBalance);
        wallet.setReserveBalance(reserveAmount);

        return walletRepository.save(wallet);
    }
}
