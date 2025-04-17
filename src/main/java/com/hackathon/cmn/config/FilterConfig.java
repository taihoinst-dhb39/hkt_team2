package com.hackathon.cmn.config;

import com.hackathon.cmn.filter.LoggingFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class FilterConfig {

    @Bean
    public FilterRegistrationBean<LoggingFilter> requestResponseLoggingFilterRegistrationBean() {
        FilterRegistrationBean<LoggingFilter> registration = new FilterRegistrationBean<>();
        registration.setFilter(new LoggingFilter());
        registration.setUrlPatterns(List.of("/*"));
        registration.setAsyncSupported(true);
        registration.setOrder(1);
        return registration;
    }

}
