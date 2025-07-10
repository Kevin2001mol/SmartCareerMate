package com.example.demo;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilter;

@Configuration
public class GatewayConfig {

    private static final Logger logger = LoggerFactory.getLogger(GatewayConfig.class);

    @Bean
    public RouteLocator routes(RouteLocatorBuilder builder) {
        GatewayFilter logFilter = (exchange, chain) -> {
            String path = exchange.getRequest().getPath().toString();
            String method = exchange.getRequest().getMethod().toString();
            String uri = exchange.getRequest().getURI().toString();
            
            logger.info("[Gateway] {} request received for path: {}, full URI: {}", method, path, uri);
            
            return chain.filter(exchange)
                .doOnNext(response -> {
                    logger.info("[Gateway] Response status: {} for path: {}", 
                        exchange.getResponse().getStatusCode(), path);
                })
                .doOnError(error -> {
                    logger.error("[Gateway] Error processing request for path {}: {}", 
                        path, error.getMessage(), error);
                });
        };
        
        return builder.routes()
            //  ❯❯  AI-service (puerto interno 8083)
            .route("ai", r -> r.path("/ai/**")
                               .filters(f -> f.filter(logFilter))
                               .uri("http://ai-service:8083"))

            //  ❯❯  Core-service (puerto interno 8082)
            .route("core", r -> r.path("/api/**")
                                 .filters(f -> f.filter(logFilter))
                                 .uri("http://core-service:8082"))

            .build();
    }
}