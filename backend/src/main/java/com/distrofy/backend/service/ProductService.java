package com.distrofy.backend.service;

import com.distrofy.backend.dto.ProductRequest;
import com.distrofy.backend.dto.ProductResponse;
import com.distrofy.backend.model.Product;
import com.distrofy.backend.model.User;
import com.distrofy.backend.model.UserRole;
import com.distrofy.backend.repository.ProductRepository;
import com.distrofy.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ProductService(ProductRepository productRepository, UserRepository userRepository) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> listPublic(String category) {
        List<Product> products = (category != null && !category.isBlank())
                ? productRepository.findByCategory(category)
                : productRepository.findByActiveTrue();
        return products.stream()
                .filter(Product::isActive)
                .map(ProductResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductResponse getPublic(Long id) {
        Product p = productRepository.findById(id)
                .filter(Product::isActive)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado"));
        return ProductResponse.from(p);
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> listMine(String sellerEmail) {
        User seller = findUser(sellerEmail);
        return productRepository.findBySeller(seller).stream()
                .map(ProductResponse::from)
                .toList();
    }

    @Transactional
    public ProductResponse create(ProductRequest request, String sellerEmail) {
        User seller = findUser(sellerEmail);
        if (seller.getRole() != UserRole.VENDOR && seller.getRole() != UserRole.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo los vendedores pueden publicar productos");
        }

        Product p = new Product();
        applyRequest(p, request);
        p.setSeller(seller);
        p.setDownloads(0);
        p.setActive(true);

        return ProductResponse.from(productRepository.save(p));
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest request, String sellerEmail) {
        Product p = findOwnedProduct(id, sellerEmail);
        applyRequest(p, request);
        return ProductResponse.from(productRepository.save(p));
    }

    @Transactional
    public void delete(Long id, String sellerEmail) {
        Product p = findOwnedProduct(id, sellerEmail);
        // Baja logica: se conserva el registro para compras existentes
        p.setActive(false);
        productRepository.save(p);
    }

    private void applyRequest(Product p, ProductRequest request) {
        p.setTitle(request.getTitle());
        p.setDescription(request.getDescription());
        p.setPrice(request.getPrice());
        p.setCategory(request.getCategory());
        p.setFileUrl(request.getFileUrl());
        p.setThumbnailUrl(request.getThumbnailUrl());
    }

    private Product findOwnedProduct(Long id, String sellerEmail) {
        User user = findUser(sellerEmail);
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado"));
        boolean isOwner = p.getSeller() != null && p.getSeller().getId().equals(user.getId());
        if (!isOwner && user.getRole() != UserRole.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No eres el vendedor de este producto");
        }
        return p;
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no encontrado"));
    }
}
