package com.hackathon.cmn.config;

import com.hackathon.cmn.interceptor.RequestContextInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@RequiredArgsConstructor
@Configuration
public class WebConfig implements WebMvcConfigurer {

    private static final String PATTERN_JS = "/js/**/*.js";
    private static final String PATTERN_JS_MAP = "/js/**/*.map";
    private static final String PATTERN_JS_CSS = "/js/**/*.css";
    private static final String PATTERN_ICO = "/favicon.ico";
    private static final String PATTERN_CSS = "/css/**";
    private static final String PATTERN_IMAGES = "/images/**";
    private static final String PATTERN_IMAGES_PNG = "/**/*.png";
    private final RequestContextInterceptor requestContextInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(requestContextInterceptor)
                .excludePathPatterns(PATTERN_JS, PATTERN_JS_MAP, PATTERN_JS_CSS, PATTERN_ICO, PATTERN_CSS, PATTERN_IMAGES, PATTERN_IMAGES_PNG);
    }

}
