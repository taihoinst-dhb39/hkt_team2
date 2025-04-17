package com.hackathon.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)  // 알 수 없는 필드 무시
public class RunDto {

    @JsonProperty("id")
    private String id;

    @JsonProperty("status")
    private String status;
}
