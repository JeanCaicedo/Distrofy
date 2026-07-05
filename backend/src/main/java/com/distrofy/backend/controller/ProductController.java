package com.distrofy.backend.controller;

import com.distrofy.backend.dto.ProductRequest;
import com.distrofy.backend.dto.ProductResponse;
import com.distrofy.backend.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // --- Catalogo publico (sin autenticacion) ---

    @GetMapping("/public")
    public ResponseEntity<List<ProductResponse>> listPublic(@RequestParam(required = false) String category) {
        return ResponseEntity.ok(productService.listPublic(category));
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<ProductResponse> getPublic(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getPublic(id));
    }

    // --- Gestion del vendedor (requiere JWT) ---

    @GetMapping("/mine")
    public ResponseEntity<List<ProductResponse>> listMine(Authentication auth) {
        return ResponseEntity.ok(productService.listMine(auth.getName()));
    }

    @PostMapping
    public ResponseEntity<ProductResponse> create(@Valid @RequestBody ProductRequest request, Authentication auth) {
        ProductResponse created = productService.create(request, auth.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> update(@PathVariable Long id,
                                                  @Valid @RequestBody ProductRequest request,
                                                  Authentication auth) {
        return ResponseEntity.ok(productService.update(id, request, auth.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication auth) {
        productService.delete(id, auth.getName());
        return ResponseEntity.noContent().build();
    }
}
