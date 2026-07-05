package com.distrofy.backend.service;

import com.distrofy.backend.dto.PurchaseResponse;
import com.distrofy.backend.model.Product;
import com.distrofy.backend.model.Purchase;
import com.distrofy.backend.model.User;
import com.distrofy.backend.repository.ProductRepository;
import com.distrofy.backend.repository.PurchaseRepository;
import com.distrofy.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class PurchaseService {

    private static final int DOWNLOAD_TOKEN_DAYS = 7;

    private final PurchaseRepository purchaseRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public PurchaseService(PurchaseRepository purchaseRepository,
                           ProductRepository productRepository,
                           UserRepository userRepository) {
        this.purchaseRepository = purchaseRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    /**
     * Checkout simulado: registra la compra como pagada y genera un token de descarga.
     * Cuando se integre Stripe, este metodo pasara a crear un PaymentIntent y el
     * webhook de Stripe sera quien marque paid=true.
     */
    @Transactional
    public PurchaseResponse checkout(Long productId, String buyerEmail) {
        User buyer = findUser(buyerEmail);
        Product product = productRepository.findById(productId)
                .filter(Product::isActive)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado"));

        if (product.getSeller() != null && product.getSeller().getId().equals(buyer.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "No puedes comprar tu propio producto");
        }

        // Si ya lo compro y el token sigue vigente, devolver la compra existente
        Purchase existente = purchaseRepository.findByUser(buyer).stream()
                .filter(p -> p.isPaid() && p.getProduct() != null && p.getProduct().getId().equals(productId))
                .filter(p -> p.getDownloadExpiry() != null && p.getDownloadExpiry().isAfter(LocalDateTime.now()))
                .findFirst().orElse(null);
        if (existente != null) {
            return PurchaseResponse.from(existente);
        }

        Purchase purchase = new Purchase();
        purchase.setUser(buyer);
        purchase.setProduct(product);
        purchase.setAmount(product.getPrice());
        purchase.setPaid(true); // simulado: sin pasarela todavia
        purchase.setPaymentIntentId("SIMULATED-" + UUID.randomUUID());
        purchase.setDownloadToken(UUID.randomUUID().toString());
        purchase.setDownloadExpiry(LocalDateTime.now().plusDays(DOWNLOAD_TOKEN_DAYS));
        purchase.setPurchasedAt(LocalDateTime.now());

        buyer.getPurchasedProducts().add(product);
        userRepository.save(buyer);

        return PurchaseResponse.from(purchaseRepository.save(purchase));
    }

    @Transactional(readOnly = true)
    public List<PurchaseResponse> myPurchases(String buyerEmail) {
        User buyer = findUser(buyerEmail);
        return purchaseRepository.findByUser(buyer).stream()
                .map(PurchaseResponse::from)
                .toList();
    }

    /**
     * Canjea un token de descarga: valida vigencia y pago, incrementa el contador
     * y devuelve la URL del archivo. El token es el unico secreto necesario.
     */
    @Transactional
    public Map<String, String> redeemDownload(String token) {
        Purchase purchase = purchaseRepository.findByDownloadToken(token)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Token de descarga invalido"));

        if (!purchase.isPaid()) {
            throw new ResponseStatusException(HttpStatus.PAYMENT_REQUIRED, "La compra no esta pagada");
        }
        if (purchase.getDownloadExpiry() == null || purchase.getDownloadExpiry().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.GONE, "El token de descarga expiro");
        }

        Product product = purchase.getProduct();
        product.setDownloads((product.getDownloads() == null ? 0 : product.getDownloads()) + 1);
        productRepository.save(product);

        return Map.of(
                "title", product.getTitle(),
                "fileUrl", product.getFileUrl()
        );
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no encontrado"));
    }
}
