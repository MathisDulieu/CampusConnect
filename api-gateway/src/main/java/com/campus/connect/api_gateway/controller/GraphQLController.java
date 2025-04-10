package com.campus.connect.api_gateway.controller;

import com.campus.connect.api_gateway.config.EnvConfiguration;
import com.campus.connect.api_gateway.model.User;
import com.campus.connect.api_gateway.model.request.LoginRequest;
import com.campus.connect.api_gateway.services.GraphQLAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.reactive.function.client.WebClient;

@Controller
@RequiredArgsConstructor
public class GraphQLController {

    private final WebClient.Builder webClientBuilder;
    private final EnvConfiguration envConfiguration;
    private final GraphQLAuthService authService;

    @QueryMapping
    public User me(@Argument(name = "token") String token) {
        if (token == null || token.isEmpty()) {
            return null;
        }

        return authService.authenticate(token);
    }

    @MutationMapping
    public String login(@Argument String email, @Argument String password) {
        return webClientBuilder.build()
                .post()
                .uri("http://authentication-service:8082/api/auth/login")
                .bodyValue(new LoginRequest(email, password))
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

}