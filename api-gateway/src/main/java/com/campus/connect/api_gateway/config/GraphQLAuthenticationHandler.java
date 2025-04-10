package com.campus.connect.api_gateway.config;

import com.campus.connect.api_gateway.dao.UserDao;
import com.campus.connect.api_gateway.model.User;
import com.campus.connect.api_gateway.model.UserRole;
import com.campus.connect.api_gateway.services.JwtTokenService;
import graphql.schema.DataFetchingEnvironment;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class GraphQLAuthenticationHandler {

    private final JwtTokenService jwtTokenService;
    private final UserDao userDao;

    public User getCurrentUser(DataFetchingEnvironment environment) {
        String token = environment.getGraphQlContext().get("token");
        if (token == null) {
            return null;
        }

        String userId = jwtTokenService.resolveUserIdFromToken(token);
        if (userId == null) {
            return null;
        }

        return userDao.findById(userId).orElse(null);
    }

    public boolean isAuthenticated(DataFetchingEnvironment environment) {
        return getCurrentUser(environment) != null;
    }

    public boolean hasRole(DataFetchingEnvironment environment, UserRole requiredRole) {
        User user = getCurrentUser(environment);
        return user != null && user.getRole() == requiredRole;
    }
}
