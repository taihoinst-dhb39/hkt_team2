package com.hackathon.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)  // 알 수 없는 필드 무시
public class MessageDto {

    @JsonProperty("id")
    private String id;

    @JsonProperty("role")
    private String role;

    @JsonProperty("createdAt")
    private String createdAt;

    @JsonProperty("content")
    private List<MessageContentDto> content;
}
