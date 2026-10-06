package com.flowfund.backend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.flowfund.backend.entity.Payout;

public interface PayoutRepository extends JpaRepository<Payout, UUID> {

    List<Payout> findByUser_IdOrderByDateDescTimeDesc(UUID userId);
}