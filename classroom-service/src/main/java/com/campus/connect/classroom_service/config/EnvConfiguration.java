package com.campus.connect.classroom_service.config;

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
}

