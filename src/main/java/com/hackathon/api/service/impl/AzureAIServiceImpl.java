package com.hackathon.api.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hackathon.api.dto.MessageResponse;
import com.hackathon.api.service.AzureAIService;
import com.hackathon.cmn.helper.HttpBuilder;
import com.hackathon.cmn.util.CmnUtil;
import com.hackathon.cmn.vo.ResponseBuilder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@Service
public class AzureAIServiceImpl implements AzureAIService {

    @Value("${spring.ai.azure.endpoint}")
    private String endpoint;

    @Value("${spring.ai.azure.api-key}")
    private String apiKey;

    @Value("${spring.ai.azure.api-version}")
    private String apiVersion;

    @Value("${spring.ai.azure.agent.tnc-agent-id}")
    private String agentId;

//    @Value("${spring.ai.azure.agent.thread-id}")
    private String threadId;
//    private final String threadId = "thread_HeAqxhc5wy1MXiehK6c8E43w";

    private final RestClient restClient;

    private static final ObjectMapper mapper = new ObjectMapper();

    @Override
    public MessageResponse sendMessage(String userMessage) throws Exception {

        String baseUrl = endpoint + "/openai/agents";

        Map<String, Object> headerMap = new HashMap<>();
//        headerMap.put("Authorization", "Bearer " + apiKey);
        headerMap.put("api-key", apiKey);

        ResponseBuilder<Object> threadVo = HttpBuilder.builder()
                .webClient(restClient)
                .uri(baseUrl + "/agents/" + agentId)
                .method(HttpMethod.GET.name())
                .headerMap(headerMap)
                .bodyObj(new HashMap<>())
                .build()
                .call();

        String agentName = mapper.readTree(CmnUtil.nvl(threadVo.getResultData())).get("name").asText();
        log.info("agentName {} : ", agentName);

        //**************************************************************************
        // 1. Thread 생성
        //**************************************************************************
//        ResponseBuilder<Object> threadVo = HttpBuilder.builder()
//                .webClient(restClient)
//                .uri(baseUrl + "/openai/agents")
//                .method(HttpMethod.POST.name())
//                .headerMap(headerMap)
//                .bodyObj("{}")
//                .build()
//                .call();
//        threadId = mapper.readTree(CmnUtil.nvl(threadVo.getResultData())).get("id").asText();
//        log.info("threadId {} : ", threadId);
//
//        if (threadId == null) throw new IllegalStateException("대화를 시작하세요.");

        //**************************************************************************
        // 2. 메시지 추가
        //**************************************************************************
//        MessageRequest messageRequest = new MessageRequest("user", userMessage);
//        MessageDto createdMessage = restClient.post()
//                .uri("/agents/v1/threads/{threadId}/messages", threadId)
//                .body(messageRequest)
//                .retrieve()
//                .body(MessageDto.class);

//        ResponseBuilder<Object> messageVo = HttpBuilder.builder()
//                .webClient(restClient)
//                .uri(baseUrl + "/threads/" + threadId + "/messages")
//                .method(HttpMethod.POST.name())
//                .headerMap(new HashMap<>())
//                .bodyObj(messageRequest)
//                .build()
//                .call();
//        MessageDto createdMessage = mapper.readValue(CmnUtil.nvl(messageVo.getResultData()), MessageDto.class);
//        log.info("createdMessage {} : ", createdMessage);

        // 실행 요청
//        RunRequest runRequest = new RunRequest(agentId);
//        RunDto run = restClient.post()
//                .uri("/agents/v1/threads/{threadId}/runs", threadId)
//                .body(runRequest)
//                .retrieve()
//                .body(RunDto.class);
//
//        // 실행 상태 polling
//        while ("queued".equals(run.getStatus()) || "in_progress".equals(run.getStatus())) {
//            try {
//                Thread.sleep(1000);
//            } catch (InterruptedException e) {
//                throw new RuntimeException(e);
//            }
//
//            run = restClient.get()
//                    .uri("/agents/v1/threads/{threadId}/runs/{runId}", threadId, run.getId())
//                    .retrieve()
//                    .body(RunDto.class);
//        }
//
//        // 응답 메시지 가져오기
//        MessageListResponse messageList = restClient.get()
//                .uri("/agents/v1/threads/{threadId}/messages", threadId)
//                .retrieve()
//                .body(MessageListResponse.class);
//
//        MessageDto latestMessage = messageList.getData().stream()
//                .filter(m -> "assistant".equals(m.getRole()))
//                .reduce((first, second) -> second)
//                .orElseThrow(() -> new RuntimeException("No assistant response"));
//
//        String content = latestMessage.getContent().stream()
//                .filter(c -> "text".equals(c.getType()))
//                .map(c -> c.getText().getValue())
//                .findFirst()
//                .orElse("");
//
//        return new MessageResponse(latestMessage.getRole(), content, latestMessage.getCreatedAt());
        return new MessageResponse();
    }

    // Thread 생성 (대화 시작)
    public String createThread() throws Exception {
        String sUri = "/openai/threads?api-version=" + apiVersion;

        Map<String, Object> headerMap = new HashMap<>();
        headerMap.put("Authorization", "Bearer " + apiKey);

        ResponseBuilder<Object> responseVo = HttpBuilder.builder()
                .webClient(restClient)
                .uri(endpoint + sUri)
                .method(HttpMethod.POST.name())
                .headerMap(headerMap)
                .bodyObj("{}")
                .build()
                .call();

        threadId = mapper.readTree(CmnUtil.nvl(responseVo.getResultData())).get("id").asText();
        return threadId;
    }

    // 메시지 보내기
    public String sendMessage2(String content) throws Exception {

        if (threadId == null) throw new IllegalStateException("대화를 시작하세요.");

        String sUri = "/openai/threads/" + threadId + "/messages?api-version=" + apiVersion;

        Map<String, Object> headerMap = new HashMap<>();
        headerMap.put("Authorization", "Bearer " + apiKey);

        Map<String, Object> bodyMap = new HashMap<>();
        bodyMap.put("role", "user");
        bodyMap.put("content", content);

        HttpBuilder.builder()
                .webClient(restClient)
                .uri(endpoint + sUri)
                .method(HttpMethod.POST.name())
                .headerMap(headerMap)
                .bodyObj(mapper.writeValueAsString(bodyMap))
                .build()
                .call();

        // Run 생성
        String sUriRun = "/openai/threads/" + threadId + "/runs?api-version=" + apiVersion;

        Map<String, Object> runBody = new HashMap<>();
        runBody.put("assistant_id", "asst_ekPy5cKGjnnZrXR4TY8dtLNR");

        ResponseBuilder<Object> responseVo = HttpBuilder.builder()
                .webClient(restClient)
                .uri(endpoint + sUriRun)
                .method(HttpMethod.POST.name())
                .headerMap(headerMap)
                .bodyObj(mapper.writeValueAsString(runBody))
                .build()
                .call();

        String sRunId = mapper.readTree(CmnUtil.nvl(responseVo.getResultData())).get("id").asText();

        // Run 상태 Polling
        String sStat;
        String sUriPoll = "/openai/threads/" + threadId + "/runs/" + sRunId + "?api-version=" + apiVersion;
        do {
            Thread.sleep(1000);
            ResponseBuilder<Object> statusVo = HttpBuilder.builder()
                    .webClient(restClient)
                    .uri(endpoint + sUriPoll)
                    .method(HttpMethod.GET.name())
                    .build()
                    .call();

            sStat = mapper.readTree(CmnUtil.nvl(statusVo.getResultData())).get("status").asText();
        } while (!"completed".equals(sStat));

        // 응답 메시지 가져오기
        String sUriRes = "/openai/threads/" + threadId + "/messages?api-version=" + apiVersion;
        ResponseBuilder<Object> messagesVo = HttpBuilder.builder()
                .webClient(restClient)
                .uri(endpoint + sUriRes)
                .method(HttpMethod.GET.name())
                .build()
                .call();

        return mapper.readTree(CmnUtil.nvl(messagesVo.getResultData()))
                .get("data").get(0).get("content").get(0).get("text").get("value").asText();
    }
}
