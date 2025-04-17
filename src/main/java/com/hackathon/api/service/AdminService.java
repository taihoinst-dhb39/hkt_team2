package com.hackathon.api.service;

import java.util.List;
import java.util.Map;

public interface AdminService {
    String readJson(Map<String, Object> paramMap);
    void writeJson(List<Map<String, Object>> paramList);
}
