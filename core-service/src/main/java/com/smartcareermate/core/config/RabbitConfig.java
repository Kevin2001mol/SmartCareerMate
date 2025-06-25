// core-service/src/main/java/com/smartcareermate/core/config/RabbitConfig.java
package com.smartcareermate.core.config;

import org.springframework.amqp.core.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

    @Value("${app.rabbit.exchange}")
    private String exchange;

    @Value("${app.rabbit.queue}")
    private String queue;

    @Value("${app.rabbit.routingKey}")
    private String routingKey;

    /** Declara cola, exchange y binding al levantar el contexto */
    @Bean
    public Declarables cvDeclarables() {
        Queue q = QueueBuilder.durable(queue).build();
        DirectExchange ex = new DirectExchange(exchange, true, false);
        Binding b = BindingBuilder.bind(q).to(ex).with(routingKey);
        return new Declarables(q, ex, b);
    }
}
