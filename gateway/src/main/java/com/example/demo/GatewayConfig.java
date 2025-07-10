package com.example.demo;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;

@Configuration
public class GatewayConfig {

        private static final Logger log = LoggerFactory.getLogger(GatewayConfig.class);

        @PostConstruct
        void init() {
                log.info(">>> GatewayConfig cargado ✔︎");
        }

        /** Filtro de log para ver las peticiones que pasan por cada ruta */
        private GatewayFilter logFilter() {
                return (exchange, chain) -> {
                        var r = exchange.getRequest();
                        log.info("[Gateway] {} {}", r.getMethod(), r.getURI());
                        return chain.filter(exchange)
                                        .doOnTerminate(() -> // ← se ejecuta tanto en éxito como en error/time-out
                        log.info("[Gateway] ↳ {}", exchange.getResponse().getStatusCode()))
                                        .doOnError(err -> log.error("[Gateway] ↳ error {}", err.getMessage(), err));
                };
        }

        @Bean
        // @Primary
        public RouteLocator routes(RouteLocatorBuilder b) {
                log.info(">>> construyendo rutas en GatewayConfig");

                RouteLocator locator = b.routes()

                                /* ---------- AI-service ---------- */
                                .route("ai", r -> r.path("/ai/**")
                                                .filters(f -> f.filter(logFilter()))
                                                .uri("http://ai-service:8083"))

                                /* ---------- CV-parser ----------- */
                                .route("cv-parser", r -> r.path("/api/cv/parse")
                                                .filters(f -> f.filter(logFilter()))
                                                .uri("http://cv-parser:8085"))

                                /* ---------- Core-service -------- */
                                .route("core-cv", r -> r.path("/api/core/cv/**")
                                                .filters(f -> f.filter(logFilter())
                                                                .rewritePath("/api/core/cv(?<segment>/.*|$)",
                                                                                "/api/cv${segment}"))
                                                .uri("http://core-service:8082"))
                                .build();

                locator.getRoutes()
                                .doOnNext(r -> log.warn("### DEBUG – Route id={} uri={}", r.getId(), r.getUri()))
                                .collectList()
                                .doOnNext(list -> log.warn("### DEBUG – Tamaño final de rutas = {}", list.size()));

                return locator;
        }

}
