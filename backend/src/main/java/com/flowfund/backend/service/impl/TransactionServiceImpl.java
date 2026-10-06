package com.flowfund.backend.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.flowfund.backend.entity.Transaction;
import com.flowfund.backend.entity.User;
import com.flowfund.backend.entity.Wallet;
import com.flowfund.backend.enums.TransactionType;
import com.flowfund.backend.enums.UserRoles;
import com.flowfund.backend.repository.TransactionRepository;
import com.flowfund.backend.repository.UserRepository;
import com.flowfund.backend.repository.WalletRepository;
import com.flowfund.backend.service.TransactionService;

import jakarta.transaction.Transactional;

@Service
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final WalletRepository walletRepository;

    public TransactionServiceImpl(
            TransactionRepository transactionRepository,
            UserRepository userRepository,
            WalletRepository walletRepository) {

        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
    }

    @Override
    public List<Transaction> getTransactionByUserId(UUID userId) {
        return transactionRepository.findByWallet_User_IdOrderByDateDescTimeDesc(userId);
    }

    @Override
    @Transactional
    public Transaction transferMoney(
            UUID senderId,
            UUID receiverId,
            BigDecimal amount) {

        if (senderId.equals(receiverId)) {
            throw new RuntimeException("Sender and receiver cannot be the same");
        }

        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Transfer amount must be greater than zero");
        }

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        if (sender.getRole() != UserRoles.FREELANCER) {
            throw new RuntimeException("Sender must be a freelancer");
        }

        if (receiver.getRole() != UserRoles.FREELANCER) {
            throw new RuntimeException("Receiver must be a freelancer");
        }

        Wallet senderWallet = walletRepository.findByUser_Id(senderId)
                .orElseThrow(() -> new RuntimeException("Sender wallet not found"));

        Wallet receiverWallet = walletRepository.findByUser_Id(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver wallet not found"));

        if (senderWallet.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient balance for transfer");
        }

        LocalDate date = LocalDate.now();
        LocalTime time = LocalTime.now();

        // Deduct from sender
        senderWallet.setBalance(
                senderWallet.getBalance().subtract(amount)
        );

        // Add to receiver
        receiverWallet.setBalance(
                receiverWallet.getBalance().add(amount)
        );

        walletRepository.save(senderWallet);
        walletRepository.save(receiverWallet);

        // Sender transaction
        Transaction senderTransaction = new Transaction();
        senderTransaction.setWallet(senderWallet);
        senderTransaction.setType(TransactionType.TRANSFER);
        senderTransaction.setAmount(amount);
        senderTransaction.setDate(date);
        senderTransaction.setTime(time);
        senderTransaction.setRemarks("Transfer to " + receiver.getName());

        transactionRepository.save(senderTransaction);

        // Receiver transaction
        Transaction receiverTransaction = new Transaction();
        receiverTransaction.setWallet(receiverWallet);
        receiverTransaction.setType(TransactionType.TRANSFER);
        receiverTransaction.setAmount(amount);
        receiverTransaction.setDate(date);
        receiverTransaction.setTime(time);
        receiverTransaction.setRemarks("Transfer from " + sender.getName());

        return transactionRepository.save(receiverTransaction);
    }
}