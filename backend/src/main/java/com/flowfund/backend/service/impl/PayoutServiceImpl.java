package com.flowfund.backend.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.flowfund.backend.entity.Payout;
import com.flowfund.backend.entity.PayoutPreferences;
import com.flowfund.backend.entity.Transaction;
import com.flowfund.backend.entity.User;
import com.flowfund.backend.entity.Wallet;
import com.flowfund.backend.enums.TransactionType;
import com.flowfund.backend.repository.PayoutPreferencesRepository;
import com.flowfund.backend.repository.PayoutRepository;
import com.flowfund.backend.repository.TransactionRepository;
import com.flowfund.backend.repository.UserRepository;
import com.flowfund.backend.repository.WalletRepository;
import com.flowfund.backend.service.PayoutService;

import jakarta.transaction.Transactional;

@Service
public class PayoutServiceImpl implements PayoutService {

    private final PayoutRepository payoutRepository;
    private final PayoutPreferencesRepository payoutPreferencesRepository;
    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;

    public PayoutServiceImpl(
            PayoutRepository payoutRepository,
            PayoutPreferencesRepository payoutPreferencesRepository,
            UserRepository userRepository,
            WalletRepository walletRepository,
            TransactionRepository transactionRepository) {

        this.payoutRepository = payoutRepository;
        this.payoutPreferencesRepository = payoutPreferencesRepository;
        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
    }

    @Override
    @Transactional
    public Payout createMonthlyPayout(UUID userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        PayoutPreferences preferences = payoutPreferencesRepository
                .findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Payout preferences not found"));

        Wallet wallet = walletRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));

        BigDecimal payoutAmount = preferences.getTargetSalary();

        if (payoutAmount == null || payoutAmount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Invalid payout amount");
        }

        if (wallet.getBalance().compareTo(payoutAmount) < 0) {
            throw new RuntimeException("Insufficient balance for monthly payout");
        }

        LocalDate date = LocalDate.now();
        LocalTime time = LocalTime.now();

        // Deduct payout amount from freelancer wallet
        wallet.setBalance(
                wallet.getBalance().subtract(payoutAmount)
        );

        walletRepository.save(wallet);

        // Create payout record
        Payout payout = new Payout();
        payout.setUser(user);
        payout.setAmount(payoutAmount);
        payout.setDate(date);
        payout.setTime(time);

        Payout savedPayout = payoutRepository.save(payout);

        // Create transaction record
        Transaction transaction = new Transaction();
        transaction.setWallet(wallet);
        transaction.setType(TransactionType.DEBIT);
        transaction.setAmount(payoutAmount);
        transaction.setDate(date);
        transaction.setTime(time);
        transaction.setRemarks("Monthly payout");

        transactionRepository.save(transaction);

        return savedPayout;
    }

    @Override
    public List<Payout> getPayoutsByUserId(UUID userId) {
        return payoutRepository.findByUser_IdOrderByDateDescTimeDesc(userId);
    }
}