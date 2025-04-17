package com.hackathon.api.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "tb_chat_log")
public class ChatLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "question", columnDefinition = "nvarchar(4000)")
    private String question;

    @Column(name = "answer", columnDefinition = "nvarchar(MAX)")
    private String answer;

}
