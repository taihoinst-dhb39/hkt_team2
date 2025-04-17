package com.hackathon.cmn.interceptor;

import com.hackathon.cmn.util.CmnUtil;
import com.hackathon.cmn.util.SpringWebUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

@Slf4j
@Component
public class RequestContextInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull Object handler) throws Exception {
        String requestURI = request.getRequestURI();

        log.debug("[RequestContextInterceptor] requestURI ::: {}", requestURI);

        if (!(handler instanceof HandlerMethod)) {
            // return true이면  Controller에 있는 메서드가 아니므로, 그대로 컨트롤러로 진행
            return HandlerInterceptor.super.preHandle(request, response, handler);
        }

        String tid = CmnUtil.nvl(SpringWebUtil.getRequestAttribute("tid"), CmnUtil.getUUID());
        SpringWebUtil.setRequestAttribute("tid", tid);

        return HandlerInterceptor.super.preHandle(request, response, handler);
    }

    @Override
    public void postHandle(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull Object handler,
            ModelAndView modelAndView) throws Exception {
        HandlerInterceptor.super.postHandle(request, response, handler, modelAndView);
    }

    @Override
    public void afterCompletion(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull Object handler,
            Exception ex) throws Exception {
        HandlerInterceptor.super.afterCompletion(request, response, handler, ex);
    }

}
