package com.flowfund.backend.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.flowfund.backend.entity.Wallet;

public interface WalletRepository extends JpaRepository<Wallet, UUID> {
    
}
