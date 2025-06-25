package com.smartcareermate.core.cv.service;

import com.smartcareermate.core.cv.messaging.ParsedCvMessage;
import com.smartcareermate.core.cv.domain.ParsedCv;
import com.smartcareermate.core.cv.repository.ParsedCvRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CvIngestionService {

    private final ParsedCvRepository repo;

    @RabbitListener(queues = "${app.rabbit.queue}")
    public void onParsedCv(ParsedCvMessage msg) {
        ParsedCv entity = ParsedCv.builder()
                .userId(msg.getUserId())
                .originalName(msg.getOriginalName())
                .rawText(msg.getRawText())
                .createdAt(msg.getCreatedAt())
                .build();
        repo.save(entity);
    }
}
