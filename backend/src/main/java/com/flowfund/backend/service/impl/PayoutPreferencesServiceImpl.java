package com.flowfund.backend.service.impl;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.flowfund.backend.entity.PayoutPreferences;
import com.flowfund.backend.entity.User;
import com.flowfund.backend.repository.PayoutPreferencesRepository;
import com.flowfund.backend.repository.UserRepository;
import com.flowfund.backend.service.PayoutPreferencesServices;

@Service 
public class PayoutPreferencesServiceImpl implements PayoutPreferencesServices {

    private final PayoutPreferencesRepository payoutPreferencesRepository;
    private final UserRepository userRepository;

    public PayoutPreferencesServiceImpl(PayoutPreferencesRepository payoutPrferencesRepository, UserRepository userRepository){
        this.payoutPreferencesRepository=payoutPrferencesRepository;
        this.userRepository=userRepository;
    }

	@Override
	public PayoutPreferences getPreferencesByUserId(UUID userId) {
		return payoutPreferencesRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Payout preferences not found"));
	}

	@Override
	public PayoutPreferences createPreferences(UUID userId, PayoutPreferences preferences) {
		if(payoutPreferencesRepository.findByUser_Id(userId).isPresent()){
            throw new RuntimeException("Payout preferences already exists");
        }

        User user=userRepository.findById(userId)
        .orElseThrow(()->new RuntimeException("User not found"));

        preferences.setUser(user);
        preferences.setCreatedAt(LocalDateTime.now());

        return payoutPreferencesRepository.save(preferences);
	}

	@Override
	public PayoutPreferences updatePreferences(UUID userId, PayoutPreferences preferences) {
		PayoutPreferences existing = payoutPreferencesRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Payout preferences not found"));

        existing.setTargetSalary(preferences.getTargetSalary());
        existing.setPayoutDate(preferences.getPayoutDate());

        return payoutPreferencesRepository.save(existing);
	}
    
}
