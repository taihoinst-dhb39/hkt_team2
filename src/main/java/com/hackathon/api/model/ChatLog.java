package com.hackathon.api.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "ChatLogTable")
public class ChatLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "question", columnDefinition = "nvarchar(100)")
    private String question;

    @Column(name = "answer", columnDefinition = "nvarchar(100)")
    private String answer;

}
