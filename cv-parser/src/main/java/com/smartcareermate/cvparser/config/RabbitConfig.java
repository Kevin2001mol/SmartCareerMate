package com.smartcareermate.cvparser.config;

import org.springframework.amqp.core.DirectExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

    public static final String EXCHANGE = "cv.direct";
    public static final String ROUTING_KEY = "cv.raw";

    @Bean
    public DirectExchange cvExchange() {
        return new DirectExchange(EXCHANGE, true, false);
    }
}
