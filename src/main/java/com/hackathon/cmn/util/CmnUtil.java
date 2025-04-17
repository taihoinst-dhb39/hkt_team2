package com.hackathon.cmn.util;

import com.hackathon.cmn.interceptor.BufferingClientHttpResponseWrapper;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.util.ResourceUtils;

import java.io.*;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.UUID;
import java.util.stream.Collectors;

public class CmnUtil {

    private CmnUtil() {
        throw new IllegalStateException("Utility class");
    }

    /**
     * Object의 null을 체크하고 값이 없으면 초기값을 넘겨준다.
     *
     * @param o            Null을 체크할 Object
     * @param defaultValue 값이 없을 때 넘겨줄 초기값
     * @return Null을 체크하여 결과값을 리턴한다.
     */
    public static String nvl(
            Object o,
            String defaultValue) {
        String returnValue = nvl(o);
        if (returnValue.isEmpty()) {
            return defaultValue;
        } else {
            return returnValue;
        }
    }

    /**
     * Object의 null을 체크하고 값이 없으면 초기값을 넘겨준다.
     *
     * @param o            Null을 체크할 Object
     * @param defaultValue 값이 없을 때 넘겨줄 초기값
     * @return Null을 체크하여 결과값을 리턴한다.
     */
    public static int nvl(
            Object o,
            int defaultValue) {
        String returnValue = nvl(o);
        if (returnValue.isEmpty()) {
            return defaultValue;
        } else {
            return Integer.parseInt(returnValue);
        }
    }

    /**
     * Object의 null을 체크하고 값이 없으면 초기값을 넘겨준다.
     *
     * @param o            Null을 체크할 Object
     * @param defaultValue 값이 없을 때 넘겨줄 초기값
     * @return Null을 체크하여 결과값을 리턴한다.
     */
    public static long nvlLong(
            Object o,
            long defaultValue) {
        String returnValue = nvl(o);
        if (returnValue.isEmpty()) {
            return defaultValue;
        } else {
            return Long.parseLong(returnValue);
        }
    }

    /**
     * Object의 null을 체크하고 값이 없으면 초기값을 넘겨준다.
     *
     * @param o            Null을 체크할 Object
     * @param defaultValue 값이 없을 때 넘겨줄 초기값
     * @return Null을 체크하여 결과값을 리턴한다.
     */
    public static double nvl(
            Object o,
            double defaultValue) {
        String returnValue = nvl(o);
        if (returnValue.isEmpty()) {
            return defaultValue;
        } else {
            return Double.parseDouble(returnValue);
        }
    }

    /**
     * 문자열의 null을 체크하고 값이 없으면 초기값을 넘겨준다. HTML 변환이 필요한 곳에서 사용한다.
     *
     * @param s            Null을 체크할 문자열
     * @param defaultValue 값이 없을 때 넘겨줄 초기값
     * @return Null을 체크하여 결과값을 리턴한다.new String(returnValue.getBytes("8859_1"), "UTF-8");
     */
    public static String nvl(
            String s,
            String defaultValue) {
        String s1;
        if (s == null) {
            s1 = defaultValue;
        } else if (s.isEmpty()) {
            s1 = defaultValue;
        } else {
            s1 = s.trim();
        }
        return s1;
    }

    /**
     * 문자열의 null을 체크하고 값이 없으면 초기값을 넘겨준다.
     *
     * @param s            Null을 체크할 문자열
     * @param defaultValue 값이 없을 때 넘겨줄 초기값
     * @return Null을 체크하여 결과값을 리턴한다.
     */
    public static int nvl(
            String s,
            int defaultValue) {
        int s1;

        if (s == null) {
            s1 = defaultValue;
        } else if (s.isEmpty()) {
            s1 = defaultValue;
        } else {
            s1 = Integer.parseInt(s);
        }
        return s1;
    }

    /**
     * 문자열의 null을 체크하고 값이 없으면 초기값을 넘겨준다. jsp에서 POST방식으로 폼 전송시 한글이 깨지는경우가 발생하여 추가
     *
     * @param s            the s
     * @param defaultValue the default value
     * @param encoding     the encoding
     * @return string
     * @throws UnsupportedEncodingException the unsupported encoding exception
     */
    public static String nvl(
            String s,
            String defaultValue,
            String encoding) throws UnsupportedEncodingException {
        String s1 = nvl(s, defaultValue);
        return URLDecoder.decode(s1, encoding);
    }

    /**
     * 문자열의 null을 체크하고 값이 없으면 초기값을 넘겨준다. jsp에서 POST방식으로 폼 전송시 한글이 깨지는경우가 발생하여 추가
     *
     * @param s            the s
     * @param defaultValue the default value
     * @param encoding     the encoding
     * @return string
     * @throws UnsupportedEncodingException the unsupported encoding exception
     */
    public static String nvl(
            Object s,
            String defaultValue,
            String encoding) throws UnsupportedEncodingException {
        String s1 = nvl(s, defaultValue);
        return URLDecoder.decode(s1, encoding);
    }

    /**
     * Object의 null을 체크한다.
     *
     * @param o the o
     * @return Null을 체크하여 결과값을 리턴한다.
     */
    public static String nvl(
            Object o) {
        return switch (o) {
            case null -> "";
            case Integer itReturnValue -> Integer.toString(itReturnValue);
            case String sReturnValue -> sReturnValue;
            case String[] value -> value[0];
            default -> o.toString();
        };
    }

    /**
     * Object Null 체크
     *
     * @param obj the obj
     * @return boolean
     */
    public static boolean isNull(Object obj) {
        return obj == null || obj.toString().trim().isEmpty();
    }

    /**
     * Gets uuid.
     *
     * @return the uuid
     */
    public static String getUUID() {
        return UUID.randomUUID().toString();
    }

    /**
     * Exception Throwable stack trace를 String으로 변환
     *
     * @param e the e
     * @return string string
     */
    public static String exceptionToString(Exception e) {
        String strException;
        if (e.getCause() == null) {
            strException = ExceptionUtils.getStackTrace(e);
        } else {
            strException = ExceptionUtils.getStackTrace(e.getCause());
        }
        return strException;
    }

    /**
     * 파일로 저장된 내용을 읽어 String 으로 변환
     *
     * @param sPath     the s path
     * @param sFileName the s file name
     * @return the string
     * @throws IOException the io exception
     */
    public static String readFileJson(
            String sPath,
            String sFileName) throws IOException {
        File file = ResourceUtils.getFile("classpath:" + sPath + "/" + sFileName + ".json");
        return new String(Files.readAllBytes(file.toPath()));
    }

    /**
     * Extract RestClient response body string.
     *
     * @param response the response
     * @return the string
     * @throws IOException the io exception
     */
    public static String extractResponseBody(ClientHttpResponse response) throws IOException {
        ClientHttpResponse bufferedResponse = new BufferingClientHttpResponseWrapper(response);
        return new BufferedReader(new InputStreamReader(bufferedResponse.getBody(), StandardCharsets.UTF_8))
                .lines()
                .collect(Collectors.joining("\n"));
    }

    public static Object convertStringToObject(Object obj) {
        JSONObject jsonObj = null;
        if (!CmnUtil.isNull(obj)) {
            try {
                jsonObj = (JSONObject) new JSONParser().parse((String) obj);
            } catch (Exception ex) {
                return obj;
            }
        }
        return jsonObj;
    }

}
