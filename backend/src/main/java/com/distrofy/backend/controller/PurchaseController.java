package com.distrofy.backend.controller;

import com.distrofy.backend.dto.PurchaseResponse;
import com.distrofy.backend.service.PurchaseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class PurchaseController {

    private final PurchaseService purchaseService;

    public PurchaseController(PurchaseService purchaseService) {
        this.purchaseService = purchaseService;
    }

    /** Checkout simulado de un producto (requiere JWT). */
    @PostMapping("/api/purchases")
    public ResponseEntity<PurchaseResponse> checkout(@RequestBody Map<String, Long> body, Authentication auth) {
        Long productId = body.get("productId");
        if (productId == null) {
            return ResponseEntity.badRequest().build();
        }
        PurchaseResponse purchase = purchaseService.checkout(productId, auth.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(purchase);
    }

    /** Historial de compras del usuario autenticado. */
    @GetMapping("/api/purchases")
    public ResponseEntity<List<PurchaseResponse>> myPurchases(Authentication auth) {
        return ResponseEntity.ok(purchaseService.myPurchases(auth.getName()));
    }

    /** Canjea un token de descarga (publico: el token es el secreto). */
    @GetMapping("/api/downloads/{token}")
    public ResponseEntity<Map<String, String>> download(@PathVariable String token) {
        return ResponseEntity.ok(purchaseService.redeemDownload(token));
    }
}
