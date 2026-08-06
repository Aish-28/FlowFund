package com.flowfund.backend.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.flowfund.backend.entity.PayoutPreferences;
import com.flowfund.backend.entity.User;

public interface PayoutPrferencesRepository extends JpaRepository<PayoutPreferences, UUID>{
    
    Optional<PayoutPreferences> findByUser(User user);
}
