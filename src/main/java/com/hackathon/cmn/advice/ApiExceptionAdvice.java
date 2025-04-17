package com.hackathon.cmn.advice;

import com.hackathon.cmn.exception.ApiException;
import com.hackathon.cmn.util.CmnUtil;
import com.hackathon.cmn.util.SpringWebUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@RestControllerAdvice
public class ApiExceptionAdvice {

    private final String LOG_SEP = "//-------------------------------------------";

    @ExceptionHandler(value = {ApiException.class, Exception.class, BadRequestException.class})
    public ResponseEntity<Object> exception(
            HttpServletRequest httpServletRequest,
            Exception exception) {
        // Exception Status, Message
        Map<String, Object> statusResult = getExceptionStatus(exception);
        int httpStatusCode = CmnUtil.nvl(statusResult.get("httpStatusCode"), 500);
        String exceptionMessage = CmnUtil.nvl(statusResult.get("statusMessage"));
        log.debug("");
        log.debug(LOG_SEP);
        log.debug("// Exception ExceptionHandler Logger");
        log.debug(LOG_SEP);
        log.debug("Exception tid ::: {}", CmnUtil.nvl(SpringWebUtil.getRequestAttribute("tid")));
        log.debug("Exception method ::: {}", httpServletRequest.getMethod());
        log.debug("Exception httpStatus ::: {}", httpStatusCode);
        log.debug("Exception message ::: {}", exceptionMessage);
        log.debug(LOG_SEP);
        log.debug("");
        return ResponseEntity.status(HttpStatus.valueOf(httpStatusCode)).body(exceptionMessage);
    }

    /**
     * Get Exception Status
     *
     * @param exception the exception
     * @return exception status
     */
    private Map<String, Object> getExceptionStatus(Exception exception) {
        Map<String, Object> statusResult = new HashMap<>();
        int httpStatusCode;
        String strMessage = CmnUtil.nvl(exception.getMessage(), CmnUtil.exceptionToString(exception));

        switch (exception) {
            case ApiException apiException -> httpStatusCode = CmnUtil.nvl(apiException.getStatusCode(), 200);
            case ResourceAccessException ignored -> httpStatusCode = CmnUtil.nvl(HttpStatus.FOUND.value(), 200);
            case NoResourceFoundException noResourceFoundException ->
                    httpStatusCode = CmnUtil.nvl(noResourceFoundException.getStatusCode().value(), 200);
            case HttpClientErrorException httpClientErrorException ->
                    httpStatusCode = CmnUtil.nvl(httpClientErrorException.getStatusCode().value(), 200);
            default -> httpStatusCode = HttpStatus.INTERNAL_SERVER_ERROR.value();
        }

        statusResult.put("httpStatusCode", httpStatusCode);
        statusResult.put("statusMessage", strMessage);

        return statusResult;
    }

}
