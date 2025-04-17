package com.hackathon.cmn.util;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Objects;

public class SpringWebUtil {

    private SpringWebUtil() {
        throw new IllegalStateException("Utility class");
    }

    public static String getSessionId() {
        return Objects.requireNonNull(RequestContextHolder.getRequestAttributes()).getSessionId();
    }

    public static void setSessionAttribute(
            String name,
            Object value) {
        Objects.requireNonNull(RequestContextHolder.getRequestAttributes()).setAttribute(name, value, RequestAttributes.SCOPE_SESSION);
    }

    public static void setRequestAttribute(
            String name,
            Object value) {
        Objects.requireNonNull(RequestContextHolder.getRequestAttributes()).setAttribute(name, value, RequestAttributes.SCOPE_REQUEST);
    }

    public static Object getSessionAttribute(String name) {
        return Objects.requireNonNull(RequestContextHolder.getRequestAttributes()).getAttribute(name, RequestAttributes.SCOPE_SESSION);
    }

    public static void removeSessionAttribute(String name) {
        Objects.requireNonNull(RequestContextHolder.getRequestAttributes()).removeAttribute(name, RequestAttributes.SCOPE_SESSION);
    }

    public static Object getRequestAttribute(String name) {
        return Objects.requireNonNull(RequestContextHolder.getRequestAttributes()).getAttribute(name, RequestAttributes.SCOPE_REQUEST);
    }

    public static HttpServletRequest getHttpServletRequest() {
        try {
            return Objects.requireNonNull(((ServletRequestAttributes) RequestContextHolder.getRequestAttributes())).getRequest();
        } catch (Exception ex) {
            return null;
        }
    }

    public static HttpServletResponse getHttpServletResponse() {
        try {
            return Objects.requireNonNull(((ServletRequestAttributes) RequestContextHolder.getRequestAttributes())).getResponse();
        } catch (Exception ex) {
            return null;
        }
    }

    public static HttpSession getHttpSession() {
        try {
            return Objects.requireNonNull(((ServletRequestAttributes) RequestContextHolder.getRequestAttributes())).getRequest().getSession();
        } catch (Exception ex) {
            return null;
        }
    }

}
