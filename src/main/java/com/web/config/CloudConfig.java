package com.web.config;


import com.cloudinary.Cloudinary;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
@SpringBootApplication
public class CloudConfig {

    @Bean
    public Cloudinary cloudinaryConfigs() {
        Cloudinary cloudinary = null;
        Map config = new HashMap();
        config.put("cloud_name", "dyhy5jhmp");
        config.put("api_key", "884398671429262");
        config.put("api_secret", "81gbFwoCD2gR0WUAM1LY28uJQaA");
        cloudinary = new Cloudinary(config);
        return cloudinary;
    }

}
