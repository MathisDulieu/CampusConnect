package com.campus.connect.authentication_service.service;

import com.campus.connect.authentication_service.dao.UserDao;
import com.campus.connect.authentication_service.model.request.LoginRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LoginService {

    private final UserDao userDao;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtTokenService jwtTokenService;

    public String authenticateUser(LoginRequest request) {
//        Optional<User> optionalUser = userDao.findByEmail(request.getEmail());
//
//        if (optionalUser.isEmpty()) {
//            return singletonMap("NOT_FOUND", "User not found");
//        }
//
//        User user = optionalUser.get();
//
//        if(!user.isValidatedEmail()) {
//            return singletonMap("FORBIDDEN", "Email is not verified");
//        }
//
//        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
//            return singletonMap("UNAUTHORIZED", "Invalid password");
//        }

        return jwtTokenService.generateToken("userId");
    }

}