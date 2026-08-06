package com.flowfund.backend.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.flowfund.backend.entity.Admin;

public interface AdminRepository extends JpaRepository<Admin, UUID>{

    Optional<Admin> findByEmail(String email);

    boolean existsByEmail(String email);
    
}
