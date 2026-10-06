package com.flowfund.backend.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.flowfund.backend.entity.Payment;
import com.flowfund.backend.entity.Transaction;
import com.flowfund.backend.entity.User;
import com.flowfund.backend.entity.Wallet;
import com.flowfund.backend.enums.PaymentStatus;
import com.flowfund.backend.enums.TransactionType;
import com.flowfund.backend.repository.PaymentRepository;
import com.flowfund.backend.repository.TransactionRepository;
import com.flowfund.backend.repository.UserRepository;
import com.flowfund.backend.repository.WalletRepository;
import com.flowfund.backend.service.PaymentService;

import jakarta.transaction.Transactional;

@Service 
public class PaymentServiceImpl implements PaymentService{

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
	private final WalletRepository walletRepository;
	private final TransactionRepository transactionRepository;

	public PaymentServiceImpl(PaymentRepository paymentRepository, UserRepository userRepository,
			WalletRepository walletRepository, TransactionRepository transactionRepository) {
		this.paymentRepository = paymentRepository;
		this.userRepository = userRepository;
		this.walletRepository = walletRepository;
		this.transactionRepository = transactionRepository;
	}

	@Override
	@Transactional
	public Payment createPayment(UUID clientId, UUID freelancerId, Payment payment) {

		User client = userRepository.findById(clientId)
				.orElseThrow(() -> new RuntimeException("Client not found"));

		User freelancer = userRepository.findById(freelancerId)
				.orElseThrow(() -> new RuntimeException("Freelancer not found"));

		if (payment.getAmount() == null
				|| payment.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
			throw new RuntimeException("Payment amount must be greater than zero");
		}

		Wallet clientWallet = walletRepository.findByUser_Id(clientId)
				.orElseThrow(() -> new RuntimeException("Client Wallet not found"));

		Wallet freelancerWallet = walletRepository.findByUser_Id(freelancerId)
				.orElseThrow(() -> new RuntimeException("Freelancer wallet not found"));

		if (clientWallet.getBalance().compareTo(payment.getAmount()) < 0) {
			throw new RuntimeException("Insufficient amount in client wallet");
		}

		LocalDate date = LocalDate.now();
		LocalTime time = LocalTime.now();

		// Set payment details
		payment.setClient(client);
		payment.setFreelancer(freelancer);
		payment.setDate(date);
		payment.setTime(time);
		payment.setStatus(PaymentStatus.SUCCESS);

		Payment savedPayment = paymentRepository.save(payment);

		// Deduct from client wallet
		clientWallet.setBalance(
				clientWallet.getBalance().subtract(payment.getAmount())
		);

		// Add to freelancer wallet
		freelancerWallet.setBalance(
				freelancerWallet.getBalance().add(payment.getAmount())
		);

		// Save wallet details
		walletRepository.save(clientWallet);
		walletRepository.save(freelancerWallet);

		// Client transaction - DEBIT
		Transaction clientTransaction = new Transaction();
		clientTransaction.setWallet(clientWallet);
		clientTransaction.setPayment(savedPayment);
		clientTransaction.setType(TransactionType.DEBIT);
		clientTransaction.setAmount(payment.getAmount());
		clientTransaction.setDate(date);
		clientTransaction.setTime(time);
		clientTransaction.setRemarks("Payment to freelancer");

		transactionRepository.save(clientTransaction);

		// Freelancer transaction - CREDIT
		Transaction freelancerTransaction = new Transaction();
		freelancerTransaction.setWallet(freelancerWallet);
		freelancerTransaction.setPayment(savedPayment);
		freelancerTransaction.setType(TransactionType.CREDIT);
		freelancerTransaction.setAmount(payment.getAmount());
		freelancerTransaction.setDate(date);
		freelancerTransaction.setTime(time);
		freelancerTransaction.setRemarks("Payment received from client");

		transactionRepository.save(freelancerTransaction);

		return savedPayment;
	}

	@Override
	public List<Payment> getPaymentsByClientId(UUID clientId) {
		return paymentRepository.findByClient_IdOrderByDateDescTimeDesc(clientId);
	}

	@Override
	public List<Payment> getPaymentsByFreelancerId(UUID freelancerId) {
		return paymentRepository.findByFreelancer_IdOrderByDateDescTimeDesc(freelancerId);
	}
    
}
