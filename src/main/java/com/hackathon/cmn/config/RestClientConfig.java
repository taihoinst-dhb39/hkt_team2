package com.hackathon.cmn.config;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.hackathon.cmn.exception.ApiException;
import com.hackathon.cmn.interceptor.ApiLoggingInterceptor;
import com.hackathon.cmn.util.CmnUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestClient;

import java.util.Arrays;
import java.util.Collections;

import static org.springframework.http.MediaType.*;

@Slf4j
@RequiredArgsConstructor
@Configuration
public class RestClientConfig {

    private final ApiLoggingInterceptor apiLoggingInterceptor;

    @Bean
    public MappingJackson2HttpMessageConverter httpMessageConverter() {
        final ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.setSerializationInclusion(Include.NON_NULL)
                .disable(SerializationFeature.FAIL_ON_EMPTY_BEANS)
                .registerModules(Collections.emptyList());
        final MappingJackson2HttpMessageConverter jacksonConverter = new MappingJackson2HttpMessageConverter(objectMapper);
        jacksonConverter.setSupportedMediaTypes(Arrays.asList(APPLICATION_JSON, APPLICATION_XML, APPLICATION_OCTET_STREAM, TEXT_HTML, TEXT_XML));
        return jacksonConverter;
    }

    @Bean
    public ClientHttpRequestInterceptor interceptor() {
        return apiLoggingInterceptor::intercept;
    }

    @Bean
    public RestClient restClient() {
        return RestClient.builder()
                .messageConverters(converters -> converters.add(httpMessageConverter()))
                //.requestFactory(getClientHttpRequestFactory())
                .requestInterceptor(interceptor())
                .defaultStatusHandler(statusCode -> !statusCode.is2xxSuccessful(), (request, response) -> {
                    String responseMessage = CmnUtil.nvl(CmnUtil.extractResponseBody(response), response.getStatusText());
                    throw new ApiException(response.getStatusCode().value(), responseMessage);
                })
                .build();
    }

}
