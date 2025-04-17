package com.hackathon.cmn.vo;

import lombok.Data;

import java.util.List;

@Data
public class ChatGPTResponse {

    private List<Choice> choices;

    @Data
    public static class Choice {
        private ChatGPTMessage message;
    }

}
