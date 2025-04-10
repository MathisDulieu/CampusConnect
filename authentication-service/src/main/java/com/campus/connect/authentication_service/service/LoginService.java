package com.campus.connect.authentication_service.service;

import com.campus.connect.authentication_service.dao.UserDao;
import com.campus.connect.authentication_service.model.User;
import com.campus.connect.authentication_service.model.request.LoginRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

import static java.util.Collections.singletonMap;

@Service
@RequiredArgsConstructor
public class LoginService {

    private final UserDao userDao;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtTokenService jwtTokenService;

    public ResponseEntity<String> authenticateUser(LoginRequest request) {
        Optional<User> optionalUser = userDao.findByEmail(request.getEmail());

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        User user = optionalUser.get();

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid password");
        }

        return ResponseEntity.status(HttpStatus.OK).body(jwtTokenService.generateToken(user.getId()));
    }

}