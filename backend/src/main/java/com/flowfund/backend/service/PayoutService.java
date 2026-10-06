package com.flowfund.backend.service;

import java.util.List;
import java.util.UUID;

import com.flowfund.backend.entity.Payout;

public interface PayoutService {

    Payout createMonthlyPayout(UUID userId);

    List<Payout> getPayoutsByUserId(UUID userId);
}