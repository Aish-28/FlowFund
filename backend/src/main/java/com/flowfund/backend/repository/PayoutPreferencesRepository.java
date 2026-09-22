package com.flowfund.backend.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.flowfund.backend.entity.PayoutPreferences;

public interface PayoutPreferencesRepository extends JpaRepository<PayoutPreferences, UUID>{
    
    Optional<PayoutPreferences> findByUser_Id(UUID userId);
}
