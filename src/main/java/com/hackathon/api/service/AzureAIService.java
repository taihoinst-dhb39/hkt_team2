package com.hackathon.api.service;

import com.hackathon.api.dto.MessageResponse;

public interface AzureAIService {

    MessageResponse sendMessage(String userMessage) throws Exception;
}
