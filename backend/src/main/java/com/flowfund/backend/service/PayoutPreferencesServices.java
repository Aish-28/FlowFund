package com.flowfund.backend.service;
import java.util.UUID;

import com.flowfund.backend.entity.PayoutPreferences;

public interface PayoutPreferencesServices {
    PayoutPreferences getPreferencesByUserId(UUID userId);

    PayoutPreferences createPreferences(UUID userId, PayoutPreferences preferences);

    PayoutPreferences updatePreferences(UUID userId, PayoutPreferences preferences);
}
