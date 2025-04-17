package com.hackathon.cmn.vo;

import lombok.Data;

import java.util.List;

@Data
public class ChatGPTRequest {

    private String model;
    //private String input;
    private List<ChatGPTMessage> messages;

}
