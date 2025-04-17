package com.hackathon.cmn.interceptor;

import com.hackathon.cmn.util.CmnUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.stream.Collectors;

@Slf4j
@Component
public class ApiLoggingInterceptor {

    public ClientHttpResponse intercept(
            HttpRequest request,
            byte[] body,
            ClientHttpRequestExecution execution) throws IOException {

        logRequest(request, body);  // Log request details
        ClientHttpResponse response = execution.execute(request, body);  // Execute the request
        ClientHttpResponse bufferedResponse = new BufferingClientHttpResponseWrapper(response); // Wrap the response
        logResponse(request, bufferedResponse);  // Log response details
        return bufferedResponse; // Return the wrapped response

    }

    private void logRequest(
            HttpRequest request,
            byte[] body) {
        // Log details of the HTTP request
        log.info("[ApiLoggingInterceptor] Request URI: {}", request.getURI());
        log.info("[ApiLoggingInterceptor] Request Method: {}", request.getMethod());
        log.info("[ApiLoggingInterceptor] Request Headers: {}", request.getHeaders());
        log.info("[ApiLoggingInterceptor] Request Body: {}", new String(body, StandardCharsets.UTF_8));
    }

    private void logResponse(
            HttpRequest request,
            ClientHttpResponse response) throws IOException {
        // Read and log the response body
        String responseBody = new BufferedReader(new InputStreamReader(response.getBody(), StandardCharsets.UTF_8))
                .lines()
                .collect(Collectors.joining("\n"));
        log.info("[ApiLoggingInterceptor] Response Status Code: {}", response.getStatusCode());
        log.info("[ApiLoggingInterceptor] Response Headers: {}", response.getHeaders());
        log.info("[ApiLoggingInterceptor] Response Body: {}", CmnUtil.nvl(responseBody, response.getStatusText()));

        if (!response.getStatusCode().is2xxSuccessful()) {
            log.error("[ApiLoggingInterceptor] HTTP request failed. {} {}", request.getMethod(), request.getURI());
        }
    }

}