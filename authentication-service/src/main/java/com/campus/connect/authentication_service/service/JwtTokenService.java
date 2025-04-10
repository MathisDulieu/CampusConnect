package com.campus.connect.authentication_service.service;

import com.campus.connect.authentication_service.config.EnvConfiguration;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.util.Date;

@Component
@RequiredArgsConstructor
public class JwtTokenService {

    private final EnvConfiguration envConfiguration;
    private static final long TOKEN_EXPIRATION_TIME = 172_800_000;

    public String generateToken(String userId) {
        Instant now = Instant.now();
        Date expiryDate = Date.from(now.plusMillis(TOKEN_EXPIRATION_TIME));

        return Jwts.builder()
                .setSubject(userId)
                .claim("type", "access")
                .setIssuedAt(Date.from(now))
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    private Key getSigningKey() {
        String secretString = envConfiguration.getJwtSecret();
        byte[] keyBytes = secretString.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

}
