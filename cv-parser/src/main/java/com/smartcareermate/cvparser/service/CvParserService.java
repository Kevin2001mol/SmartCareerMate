package com.smartcareermate.cvparser.service;

import java.io.InputStream;
import org.apache.tika.Tika;
import org.springframework.stereotype.Service;

@Service
public class CvParserService {
    private final Tika tika = new Tika();

    public String parse(InputStream is) throws Exception {
        return tika.parseToString(is);
    }
}
