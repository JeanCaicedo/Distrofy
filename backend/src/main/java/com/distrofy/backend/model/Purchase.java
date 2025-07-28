package com.distrofy.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "purchases")
public class Purchase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "payment_intent_id")
    private String paymentIntentId;

    @Column(precision = 10, scale = 2)
    private BigDecimal amount;

    private boolean paid;

    @Column(name = "download_token")
    private String downloadToken;

    @Column(name = "download_expiry")
    private LocalDateTime downloadExpiry;

    @Column(name = "purchased_at")
    private LocalDateTime purchasedAt;
}