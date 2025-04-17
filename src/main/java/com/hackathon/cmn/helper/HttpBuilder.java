package com.hackathon.cmn.helper;

import com.hackathon.cmn.constant.Constant;
import com.hackathon.cmn.util.CmnUtil;
import com.hackathon.cmn.vo.ResponseBuilder;
import lombok.Builder;
import lombok.Builder.Default;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriUtils;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.function.Consumer;

@Slf4j
@Setter
@Builder
public class HttpBuilder {

    private RestClient webClient;

    @Default
    private String method = HttpMethod.POST.name();

    private String uri;

    @Default
    private boolean isEncoding = Boolean.FALSE;

    @Default
    private Map<String, Object> headerMap = new LinkedHashMap<>();

    @Default
    private Object bodyObj = new Object();

    @Default
    private Map<String, Object> queryParamMap = new HashMap<>();

    @Default
    private Map<String, Object> uriParamMap = new HashMap<>();

    public ResponseBuilder<Object> call() {
        ResponseBuilder<Object> responseVo;

        // GET Method 방식 처리
        //---------------------------------
        // queryParamMap Parsing
        MultiValueMap<String, String> queryMap = new LinkedMultiValueMap<>();
        queryParamMap.forEach((key, value) -> queryMap.add(key, CmnUtil.nvl(value)));
        MultiValueMap<String, String> urlQueryMap = new LinkedMultiValueMap<>();
        if (this.isEncoding) {
            urlQueryMap.putAll(UriUtils.encodeQueryParams(queryMap));
        } else {
            urlQueryMap.putAll(queryMap);
        }
        //---------------------------------

        ResponseEntity<String> resonseResult = webClient.method(getHttpMethod(this.method))
                .uri(this.uri, uriBuilder -> uriBuilder.queryParams(urlQueryMap).build(uriParamMap))
                .headers(this.getCommonHeader(headerMap))
                .acceptCharset(StandardCharsets.UTF_8)
                .accept(MediaType.APPLICATION_JSON)
                .body(bodyObj)
                .retrieve()
                .toEntity(String.class);

        // 결과 담기
        responseVo = ResponseBuilder.builder()
                .httpStatus(HttpStatus.resolve(resonseResult.getStatusCode().value()))
                .resultCode(Constant.SUCCESS_CD)
                .resultData(resonseResult.getBody())
                .build();

        return responseVo;
    }

    private Consumer<HttpHeaders> getCommonHeader(
            Map<String, Object> headerMap) {
        if (this.method.toUpperCase().equals(HttpMethod.POST.name())) {
            headerMap.put(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
        }
        headerMap.put(HttpHeaders.CACHE_CONTROL, "no-cache");
        headerMap.put(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE);
        headerMap.put(HttpHeaders.ACCEPT_CHARSET, StandardCharsets.UTF_8);

        LinkedMultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
        headerMap.forEach((key, value) -> headers.add(key, CmnUtil.nvl(value)));

        return it -> it.addAll(headers);
    }

    /**
     * Get HttpMethod
     */
    private HttpMethod getHttpMethod(String infMthdCd) {
        HttpMethod httpMethod = HttpMethod.POST;
        if ("GET".equals(infMthdCd)) {
            httpMethod = HttpMethod.GET;
        } else if ("PUT".equals(infMthdCd)) {
            httpMethod = HttpMethod.PUT;
        } else if ("DELETE".equals(infMthdCd)) {
            httpMethod = HttpMethod.DELETE;
        }
        return httpMethod;
    }

}
