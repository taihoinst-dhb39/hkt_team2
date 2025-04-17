package com.hackathon.cmn.exception;

import lombok.Getter;

import java.io.Serial;

@Getter
public class ApiException extends RuntimeException {

    @Serial
    private static final long serialVersionUID = 5517429915696121759L;

    private int statusCode;

    public ApiException(String message) {
        super(message);
    }

    public ApiException(
            int statusCode,
            String message) {
        super(message);
        this.statusCode = statusCode;
    }

}
