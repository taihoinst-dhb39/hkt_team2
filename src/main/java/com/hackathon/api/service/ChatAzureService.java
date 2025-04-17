package com.hackathon.api.service;

import com.fasterxml.jackson.core.JsonProcessingException;

public interface ChatAzureService {

    String getChatResponse(String userMessage) throws JsonProcessingException;

}
