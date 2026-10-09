package com.flowfund.backend.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.flowfund.backend.entity.User;
import com.flowfund.backend.enums.UserRoles;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByPhNo(String phNo);

    List<User> findAllByOrderByCreatedAtDesc();

    long countByRole(UserRoles role);

    boolean existsByPhNoAndIdNot(String phNo, UUID id);
}