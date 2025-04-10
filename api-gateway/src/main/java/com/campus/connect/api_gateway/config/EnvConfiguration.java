package com.campus.connect.api_gateway.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "campus.connect.properties")
public class EnvConfiguration {
    private String databaseName;
    private String jwtSecret;
    private String mongoUri;
    private String userServiceUrl;
    private String authServiceUrl;
    private String classroomServiceUrl;
    private String gradeServiceUrl;
}