package com.distrofy.backend.service;

import com.distrofy.backend.dto.AuthRequest;
import com.distrofy.backend.dto.AuthResponse;
import com.distrofy.backend.dto.RegisterRequest;
import com.distrofy.backend.model.User;
import com.distrofy.backend.model.UserRole;
import com.distrofy.backend.repository.UserRepository;
import com.distrofy.backend.security.JwtTokenUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtil jwtTokenUtil;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository, 
                      PasswordEncoder passwordEncoder, 
                      JwtTokenUtil jwtTokenUtil,
                      AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenUtil = jwtTokenUtil;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(UserRole.valueOf(request.getRole()));
        user.setActive(true);

        User savedUser = userRepository.save(user);
        
        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(savedUser.getEmail())
                .password(savedUser.getPasswordHash())
                .authorities("ROLE_" + savedUser.getRole().name())
                .build();

        String token = jwtTokenUtil.generateToken(userDetails);
        
        return new AuthResponse(token, savedUser.getEmail(), 
                              savedUser.getRole().name(), savedUser.getName());
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPasswordHash())
                .authorities("ROLE_" + user.getRole().name())
                .build();

        String token = jwtTokenUtil.generateToken(userDetails);
        
        return new AuthResponse(token, user.getEmail(), 
                              user.getRole().name(), user.getName());
    }
} 