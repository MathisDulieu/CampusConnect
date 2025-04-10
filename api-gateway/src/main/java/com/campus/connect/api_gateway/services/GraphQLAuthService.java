package com.campus.connect.api_gateway.services;

import com.campus.connect.api_gateway.dao.UserDao;
import com.campus.connect.api_gateway.model.User;
import com.campus.connect.api_gateway.model.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class GraphQLAuthService {

    private final JwtTokenService jwtTokenService;
    private final UserDao userDao;

    public User authenticate(String token) {
        if (token == null || token.isEmpty()) {
            return null;
        }

        String userId = jwtTokenService.resolveUserIdFromToken(token);
        if (userId == null) {
            return null;
        }

        return userDao.findById(userId).orElse(null);
    }

    public void validateAuthentication(String token) {
        User user = authenticate(token);
        if (user == null) {
            throw new RuntimeException("Authentication required");
        }
    }

    public void validateRole(String token, UserRole requiredRole) {
        User user = authenticate(token);
        if (user == null || user.getRole() != requiredRole) {
            throw new RuntimeException("Insufficient permissions");
        }
    }
}