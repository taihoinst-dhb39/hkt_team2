package com.hackathon.api.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hackathon.api.service.ChatAzureService;
import com.hackathon.cmn.helper.HttpBuilder;
import com.hackathon.cmn.util.CmnUtil;
import com.hackathon.cmn.vo.ChatGPTMessage;
import com.hackathon.cmn.vo.ChatGPTRequest;
import com.hackathon.cmn.vo.ChatGPTResponse;
import com.hackathon.cmn.vo.ResponseBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@Service
public class ChatAzureServiceImpl implements ChatAzureService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;
    //    @Value("${spring.ai.azure.openai.api-key}")
    @Value("${spring.ai.azure.api-key}")
    private String apiKey;
    //    @Value("${spring.ai.azure.openai.endpoint}")
    @Value("${spring.ai.azure.endpoint}")
    private String apiUrl;

    public String getChatResponse(String userMessage) throws JsonProcessingException {
        List<ChatGPTMessage> messageList = new LinkedList<>();

        ChatGPTMessage userMessageObj = new ChatGPTMessage();
        userMessageObj.setRole("system");
        userMessageObj.setContent("You are a helpful assistant");
        messageList.add(userMessageObj);

        userMessageObj = new ChatGPTMessage();
        userMessageObj.setRole("user");
        userMessageObj.setContent(userMessage);
        messageList.add(userMessageObj);

        ChatGPTRequest request = new ChatGPTRequest();
        request.setModel("gpt-4o");
        request.setMessages(messageList);

        Map<String, Object> headerMap = new HashMap<>();
        headerMap.put("Authorization", "Bearer " + apiKey);

        ResponseBuilder<Object> responseVo = HttpBuilder.builder()
                .webClient(restClient)
                .uri(apiUrl)
                .method(HttpMethod.POST.name())
                .headerMap(headerMap)
                .bodyObj(request)
                .build()
                .call();

        ChatGPTResponse response = objectMapper.readValue(CmnUtil.nvl(responseVo.getResultData()), ChatGPTResponse.class);
        return response != null && !response.getChoices().isEmpty()
                ? response.getChoices().getFirst().getMessage().getContent()
                : "No response from Azure Chat";
    }

}
