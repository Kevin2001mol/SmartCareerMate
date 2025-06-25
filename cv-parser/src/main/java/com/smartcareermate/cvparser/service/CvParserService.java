package com.smartcareermate.cvparser.service;

import com.smartcareermate.messaging.ParsedCvMessage;
import lombok.RequiredArgsConstructor;
import org.apache.tika.Tika;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.io.InputStream;

import static com.smartcareermate.cvparser.config.RabbitConfig.EXCHANGE;
import static com.smartcareermate.cvparser.config.RabbitConfig.ROUTING_KEY;

@Service
@RequiredArgsConstructor
public class CvParserService {

    private final RabbitTemplate rabbitTemplate;
    private final Tika tika = new Tika();

    /**
     * Extrae texto del PDF y lo envía a RabbitMQ.
     */
    public void parseAndSend(Long userId, String filename, InputStream is) throws Exception {
        String text = tika.parseToString(is);

        ParsedCvMessage msg = ParsedCvMessage.builder()
                .userId(userId)
                .originalName(filename)
                .rawText(text)
                .build();

        rabbitTemplate.convertAndSend(EXCHANGE, ROUTING_KEY, msg);
    }
}
