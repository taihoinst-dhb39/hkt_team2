package com.hackathon.cmn.vo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.hackathon.cmn.constant.Constant;
import lombok.Getter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;

import java.io.Serial;
import java.io.Serializable;

@Getter
public class ResponseBuilder<T> implements Serializable {

    @Serial
    private static final long serialVersionUID = 7482875087704292860L;

    private final String resultCode;
    private final String resultMessage;

    @JsonIgnore
    private final HttpStatus httpStatus;
    private final transient T resultData;

    @JsonIgnore
    private final HttpHeaders headers;

    private ResponseBuilder(ResponseBuilderBuilder<T> builder) {
        this.resultCode = builder.resultCodeValue;
        this.resultMessage = builder.resultMessageValue;
        this.httpStatus = builder.httpStatusValue;
        this.resultData = builder.resultData;
        this.headers = builder.headers;
    }

    public static <T> ResponseBuilderBuilder<T> builder() {
        return new ResponseBuilderBuilder<>();
    }

    @SuppressWarnings("unchecked")
    public ResponseBuilderBuilder<T> toBuilder() {
        return (ResponseBuilderBuilder<T>) (new ResponseBuilderBuilder<>())
                .resultCode(this.resultCode)
                .resultMessage(this.resultMessage)
                .httpStatus(this.httpStatus)
                .resultData(this.resultData)
                .headers(this.headers);
    }

    public static class ResponseBuilderBuilder<T> {
        private boolean resultCodeSet = false;
        private String resultCodeValue;
        private boolean resultMessageSet = false;
        private String resultMessageValue;
        private boolean httpStatusSet = false;
        private HttpStatus httpStatusValue;
        private T resultData;
        private HttpHeaders headers;

        public ResponseBuilderBuilder<T> resultCode(String resultCode) {
            this.resultCodeValue = resultCode;
            this.resultCodeSet = true;
            if (!resultCode.equals(Constant.SUCCESS_CD)) {
                this.resultMessageValue = Constant.FAIL_MSG;
                this.resultMessageSet = true;
            }
            return this;
        }

        public ResponseBuilderBuilder<T> resultMessage(String resultMessage) {
            this.resultMessageValue = resultMessage;
            this.resultMessageSet = true;
            String[] aMsg = resultMessage.split("\\|");
            if (aMsg.length == 1) {
                this.resultMessageValue = aMsg[0];
            } else if (aMsg.length == 2) {
                this.resultCodeValue = String.valueOf(aMsg[0]);
                this.resultCodeSet = true;
                this.resultMessageValue = aMsg[1];
            } else if (aMsg.length == 3) {
                this.resultCodeValue = String.valueOf(aMsg[0]);
                this.resultCodeSet = true;
                this.resultMessageValue = aMsg[2];
                this.httpStatusValue = HttpStatus.valueOf(Integer.parseInt(aMsg[1]));
                this.httpStatusSet = true;
            }
            return this;
        }

        @JsonIgnore
        public ResponseBuilderBuilder<T> httpStatus(HttpStatus httpStatus) {
            this.httpStatusValue = httpStatus;
            this.httpStatusSet = true;
            return this;
        }

        public ResponseBuilderBuilder<T> resultData(T resultData) {
            this.resultData = resultData;
            return this;
        }

        @JsonIgnore
        public ResponseBuilderBuilder<T> headers(HttpHeaders headers) {
            this.headers = headers;
            return this;
        }

        public ResponseBuilder<T> build() {
            if (!this.resultCodeSet) {
                this.resultCodeValue = Constant.SUCCESS_CD;
            }
            if (!this.resultMessageSet) {
                this.resultMessageValue = "";
            }
            if (!this.httpStatusSet) {
                this.httpStatusValue = HttpStatus.OK;
            }
            return new ResponseBuilder<>(this);
        }

        public String toString() {
            return "ResponseBuilder.ResponseBuilderBuilder(resultCodeValue=" + this.resultCodeValue + ", resultMessageValue=" + this.resultMessageValue + ", httpStatusValue=" + this.httpStatusValue + ", resultData=" + this.resultData + ", headers=" + this.headers + ")";
        }
    }

}
