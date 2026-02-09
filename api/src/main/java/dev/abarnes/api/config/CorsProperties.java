package dev.abarnes.api.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;

@ConfigurationProperties(prefix = "cors")
public record CorsProperties(
    @DefaultValue("http://localhost:5173") String[] allowedOrigins
) {}
