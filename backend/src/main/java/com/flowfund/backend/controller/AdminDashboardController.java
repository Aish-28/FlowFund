package com.flowfund.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.flowfund.backend.dto.AdminDashboardResponse;
import com.flowfund.backend.service.AdminDashboardService;

@RestController
@RequestMapping("/api/admin/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;

    public AdminDashboardController(
            AdminDashboardService adminDashboardService) {
        this.adminDashboardService = adminDashboardService;
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminDashboardResponse> getDashboardStats() {

        AdminDashboardResponse response = new AdminDashboardResponse(
                adminDashboardService.getTotalUsers(),
                adminDashboardService.getTotalClients(),
                adminDashboardService.getTotalFreelancers(),
                adminDashboardService.getTotalPayments(),
                adminDashboardService.getTotalPaymentAmount(),
                adminDashboardService.getTotalTransactions()
        );

        return ResponseEntity.ok(response);
    }
}