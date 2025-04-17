package com.hackathon.api.controller;

import com.hackathon.api.model.ChatLog;
import com.hackathon.api.repository.ChatLogRepository;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/chat/log")
public class ChatLogController {

    private final ChatLogRepository chatLogRepository;

    public ChatLogController(ChatLogRepository chatLogRepository) {
        this.chatLogRepository = chatLogRepository;
    }

    @GetMapping
    public List<ChatLog> getChatLogs(HttpServletResponse response) {
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json; charset=UTF-8");

        List<ChatLog> chatLogList = chatLogRepository.findAll();
        for(ChatLog chatLog : chatLogList) {
            log.info("chatLog : {}", chatLog);
        }

        return chatLogRepository.findAll();
    }

    @PostMapping
    public ChatLog createChatLog(@RequestBody ChatLog chatLog) {
        log.info("chatLog : {}", chatLog);
        return chatLogRepository.save(chatLog);
    }

    @GetMapping("/delete")
    public void deleteChatLog() {
        chatLogRepository.deleteAll();
    }

}
