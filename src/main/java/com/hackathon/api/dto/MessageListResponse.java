package com.hackathon.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)  // 알 수 없는 필드 무시
public class MessageListResponse {

    @JsonProperty("data")
    private List<MessageDto> data;
}
