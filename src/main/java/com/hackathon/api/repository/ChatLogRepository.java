package com.hackathon.api.repository;

import com.hackathon.api.model.ChatLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatLogRepository  extends JpaRepository<ChatLog, Long> {
}
