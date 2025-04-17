package com.hackathon.cmn.constant;

import java.time.Duration;

public class Constant {

    public static final String SUCCESS_CD = "0";
    public static final String FAIL_CD = "1";
    public static final String ERROR_CD = "500";
    public static final String FAIL_MSG = "FAIL";
    public static final Duration REST_CONNECT_TIMEOUT = Duration.ofSeconds(15); // 15 Second
    public static final Duration REST_READ_TIMEOUT = Duration.ofSeconds(15); // 15 Second
    private Constant() {
        throw new IllegalStateException("Constant class");
    }

}
