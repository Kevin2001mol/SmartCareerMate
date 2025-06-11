package com.example.demo;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Configuration
public class GatewayConfig {

    private static final Logger logger = LoggerFactory.getLogger(GatewayConfig.class);

    @Bean
    public RouteLocator routes(RouteLocatorBuilder builder) {
        GatewayFilter logFilter = (exchange, chain) -> {
            String path = exchange.getRequest().getPath().toString();
            logger.info("[Gateway] Request received for path: {}", path);
            return chain.filter(exchange);
        };
        return builder.routes()

            //  ❯❯  IA  (puerto 8083)
            .route("ai", r -> r.path("/ai/**")
                               .filters(f -> f.filter(logFilter))
                               .uri("http://ai-service:8083"))

            //  ❯❯  Core-service  (puerto 8082)
            .route("core", r -> r.path("/api/**")
                                 .filters(f -> f.filter(logFilter))
                                 .uri("http://core-service:8082"))

            .build();
    }
}
