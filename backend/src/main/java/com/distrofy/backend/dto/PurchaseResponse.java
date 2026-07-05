package com.distrofy.backend.dto;

import com.distrofy.backend.model.Purchase;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseResponse {

    private Long id;
    private Long productId;
    private String productTitle;
    private String thumbnailUrl;
    private BigDecimal amount;
    private boolean paid;
    private String downloadToken;
    private LocalDateTime downloadExpiry;
    private LocalDateTime purchasedAt;

    public static PurchaseResponse from(Purchase p) {
        return new PurchaseResponse(
                p.getId(),
                p.getProduct() != null ? p.getProduct().getId() : null,
                p.getProduct() != null ? p.getProduct().getTitle() : null,
                p.getProduct() != null ? p.getProduct().getThumbnailUrl() : null,
                p.getAmount(),
                p.isPaid(),
                p.getDownloadToken(),
                p.getDownloadExpiry(),
                p.getPurchasedAt()
        );
    }
}
