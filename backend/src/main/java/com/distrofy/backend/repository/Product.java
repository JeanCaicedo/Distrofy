package com.distrofy.backend.repository;

import com.distrofy.backend.model.Product;
import com.distrofy.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findBySeller(User seller);
    List<Product> findByActiveTrue();
    List<Product> findByCategory(String category);
}