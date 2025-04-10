package com.campus.connect.api_gateway.config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.graphql.server.WebGraphQlInterceptor;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Configuration
public class GraphQlConfig {

    @Bean
    public WebGraphQlInterceptor requestContextInterceptor() {
        return (request, chain) -> {
            ServletRequestAttributes attributes =
                    (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

            HttpServletRequest httpRequest = attributes.getRequest();
            request.configureExecutionInput((executionInput, builder) ->
                    builder.graphQLContext(context -> context.put("request", httpRequest)).build());

            return chain.next(request);
        };
    }
}