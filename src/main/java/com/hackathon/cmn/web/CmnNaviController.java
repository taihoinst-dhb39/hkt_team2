package com.hackathon.cmn.web;

import com.hackathon.api.service.AzureAIService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

@RequiredArgsConstructor
@Controller
public class CmnNaviController {

    private final AzureAIService azureAiService;

    @GetMapping(value = "/chatAzure")
    public ModelAndView chatAzure() {
        return new ModelAndView("/pages/chatAzure");
    }

}
