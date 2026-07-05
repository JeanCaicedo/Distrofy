package com.distrofy.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {

    @NotBlank(message = "El titulo es obligatorio")
    private String title;

    private String description;

    @NotNull(message = "El precio es obligatorio")
    @DecimalMin(value = "0.0", message = "El precio no puede ser negativo")
    private BigDecimal price;

    @NotBlank(message = "La categoria es obligatoria")
    private String category;

    @NotBlank(message = "La URL del archivo es obligatoria")
    private String fileUrl;

    private String thumbnailUrl;
}
