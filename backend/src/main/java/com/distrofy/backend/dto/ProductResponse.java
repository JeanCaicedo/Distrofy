package com.distrofy.backend.dto;

import com.distrofy.backend.model.Product;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

// Respuesta publica de producto: nunca expone fileUrl (solo se entrega via token de descarga)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {

    private Long id;
    private String title;
    private String description;
    private BigDecimal price;
    private String category;
    private String thumbnailUrl;
    private Long sellerId;
    private String sellerName;
    private Integer downloads;
    private LocalDateTime createdAt;

    public static ProductResponse from(Product p) {
        return new ProductResponse(
                p.getId(),
                p.getTitle(),
                p.getDescription(),
                p.getPrice(),
                p.getCategory(),
                p.getThumbnailUrl(),
                p.getSeller() != null ? p.getSeller().getId() : null,
                p.getSeller() != null ? p.getSeller().getName() : null,
                p.getDownloads(),
                p.getCreatedAt()
        );
    }
}
