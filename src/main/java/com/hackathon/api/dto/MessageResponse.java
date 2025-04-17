package com.hackathon.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse {

    @JsonProperty("role")
    private String role;

    @JsonProperty("message")
    private String message;

    @JsonProperty("createdAt")
    private String createdAt;

}
