package com.hackathon.api.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hackathon.api.service.AdminService;
import com.hackathon.cmn.util.CmnUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONArray;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@Service
public class AdminServiceImpl implements AdminService {

    private final ObjectMapper objectMapper;

    public String readJson(Map<String, Object> paramMap) {
        String response = null;
        try {
            response = CmnUtil.readFileJson("json", "messageLog");
        } catch (IOException e) {
            log.info(e.getMessage());
        }
        return response;
    }

    public void writeJson(List<Map<String, Object>> paramList) {

//        JSONObject jsonObj = new JSONObject();
        JSONArray jsonArray = new JSONArray();
//        for (Map<String, Object> map : paramList) {
//            jsonArray.add(convertMapToJson(map));
//
//            jsonObj.putAll(map);
//            log.debug("jsonObj : {}", jsonObj);
//
//            ClassPathResource resource = new ClassPathResource("json/messageLog.json");
//            try {
//                Path path = Paths.get(resource.getURI());
//                BufferedWriter bufferedWriter = new BufferedWriter(new FileWriter(path.toString(), false));
//
//                bufferedWriter.write(jsonObj.toString());
//                bufferedWriter.newLine();
//
//                bufferedWriter.flush();
//                bufferedWriter.close();
//            } catch (IOException e) {
//                log.info(e.getMessage());
//            }
//        }

//        FileWriter fileWriter = null;
//        try {
//            ClassPathResource resource = new ClassPathResource("json/messageLog.json");
//            Path path = Paths.get(resource.getURI());
//            log.debug("path  : " + path);
//
//            File file = new File(path.toString());
//            if (!file.exists()) {
//                file.createNewFile();
//            }
//
//            fileWriter = new FileWriter(file);
//            BufferedWriter writer = new BufferedWriter(fileWriter);
//            writer.write(jsonObj.toString());
//            writer.close();
//        } catch (Exception e) {
//            log.info(e.getMessage());
//        } finally {
//            if (fileWriter != null) {
//                try {
//                    fileWriter.close();
//                } catch (IOException e) {
//                    log.info(e.getMessage());
//                }
//            }
//        }
    }

}
