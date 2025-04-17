package com.hackathon.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)  // 알 수 없는 필드 무시
public class MessageContentDto {

    @JsonProperty("type")
    private String type;

    @JsonProperty("text")
    private TextContent text;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)  // 알 수 없는 필드 무시
    public static class TextContent {

        @JsonProperty("value")
        private String value;
    }
}
