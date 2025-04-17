package com.hackathon.api.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.hackathon.api.service.ChatAzureService;
import com.hackathon.cmn.util.CmnUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api")
@RestController
public class ChatAzureController {

    private final ChatAzureService chatAzureService;

    @PostMapping(value = "/callAzure", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Object> callAzure(
            @RequestHeader Map<String, String> headersMap,
            @RequestBody Map<String, Object> paramMap) throws JsonProcessingException {
        log.debug("Request Post headersMap: {}", headersMap);
        log.debug("Request Post paramMap: {}", paramMap);

        Map<String, String> responses = new HashMap<>();
        String message = CmnUtil.nvl(paramMap.get("input"));

        String openAiResponse = chatAzureService.getChatResponse(message);
        responses.put("vertexai", openAiResponse);
        return ResponseEntity.ok().body(responses);
    }

}
