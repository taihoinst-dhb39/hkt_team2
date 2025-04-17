package com.hackathon.cmn.filter;

import com.hackathon.cmn.util.CmnUtil;
import com.hackathon.cmn.util.SpringWebUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class LoggingFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        if (CmnUtil.isNull(request.getHeader("tid"))) {
            SpringWebUtil.setRequestAttribute("tid", CmnUtil.getUUID());
        }
        filterChain.doFilter(request, response);

    }

}
