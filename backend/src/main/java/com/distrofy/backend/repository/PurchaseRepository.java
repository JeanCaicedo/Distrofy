package com.distrofy.backend.repository;

import com.distrofy.backend.model.Purchase;
import com.distrofy.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
    List<Purchase> findByUser(User user);
    Optional<Purchase> findByDownloadToken(String downloadToken);
}