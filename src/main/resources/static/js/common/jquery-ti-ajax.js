/*!
 * jQuery Ajax Plugin
 * Copyright (C) 2024 by Taihoinst CO.,LTD. All right reserved.
 * Version: 2.0.0
 */
(function($) {
    "use strict";

    // tiAjax init data
    let defaults = {
        category: 'data',        // api : open api 호출, param, data
        url: '',                 // send url
        type: 'post',            // send method
        data: {},                // data set - 특정 데이터를 넘기고 싶을 때 사용할 수 있고 기존 필드값이 있으면 merge된다.
        dataType: 'json',
        async: true,
        timeout: 90000,
        apidiv: 'data',          // data, file
        headers: {'Content-Type': 'application/json'},
        beforeSend: '',
        success: '',             // success callback
        error: '',               // error callback
        complete: '',            // complete callback
        contentType: 'application/json; charset=UTF-8',
        csrfHeader: '',
        csrfToken: '',
        isXsrf: false,
        isloading: true,
        isloadingend: true,
        crossDomain: false,
        apidata: {}              // 내부에서 사용 (Temp variable)
    };

    const TiUtils = class TiUtils {
        /**
         * object deep copy
         * @returns {{}}
         */
        static extend() {
            // Variables
            let extended = {};
            let deep = false;
            let i = 0;
            let length = arguments.length;

            // Check if a deep merge
            if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
                deep = arguments[0];
                i++;
            }

            // Merge the object into the extended object
            let merge = function (obj) {
                for ( let prop in obj ) {
                    if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
                        // If deep merge and property is an object, merge properties
                        if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
                            extended[prop] = TiUtils.extend( true, extended[prop], obj[prop] );
                        } else {
                            extended[prop] = obj[prop];
                        }
                    }
                }
            };

            // Loop through each object and conduct a merge
            for ( ; i < length; i++ ) {
                let obj = arguments[i];
                merge(obj);
            }

            return extended;
        }
    }

    // jqAjaxCall 생성자
    class jqAjaxCall {
        constructor(options) {
            this.options = options;
            this.config = {};
        }
        init() {
            this.config = TiUtils.extend(true, defaults, this.options);
            this.tiAjaxFunc();
            return this;
        }
        /**
         * Statements category가 form, data인 경우 호출되는 내부함수 input의
         * name을 binding 하여 서버로 전송한다.
         */
        tiAjaxFunc() {
            let selfConfig = this.config;
            let data = {};

            //--------------------------------------------
            // form element parameter setting
            //--------------------------------------------
            if (selfConfig.category !== "param" && selfConfig.category !== "api") {   // param이 아니면
                $("#"+selfConfig.applyId+" :input[type != button]").each(function(_i, _obj) {
                    let _this = $(this);
                    let _thisVal = _this.val();
                    let _thisId = _this.attr("id");
                    let _thisName = _this.attr("name");
                    let _thisType = _this.attr("type");
                    let _thisPropTagName = _this.prop("tagName");
                    // type이 checkbox
                    if (_thisType === "checkbox") {
                        // 선택되어 있으면
                        if (_this.is(":checked")) {
                            // 등록된 값이 없다면
                            if (typeof data[_thisType] === "undefined" || data[_thisType] === "") {
                                data[_thisName] = _thisVal;
                            } else {
                                data[_thisName] += ","+_thisVal;
                            }
                        }
                    // type이 radio
                    } else if (_thisType === "radio") {
                        // 선택되어 있으면
                        if (_this.is(":checked")) {
                            data[_thisName] = _thisVal;
                        }
                    // type이 input, text area, select etc
                    } else if (_thisPropTagName.toUpperCase() === "INPUT" || _thisPropTagName.toUpperCase() === "TEXTAREA") {
                        data[_thisName] = _thisVal;
                    } else if (_thisPropTagName.toUpperCase() === "SELECT") {
                        _thisVal = $('#' + _thisId + ' option:selected').val();
                        data[_thisName] = _thisVal;
                    }
                });
            }
            //--------------------------------------------

            //--------------------------------------------
            // 공통 parameter setting
            //--------------------------------------------
            selfConfig.data = TiUtils.extend(true, selfConfig.data, data);
            //--------------------------------------------

            if (selfConfig.category === "api") {    // API Ajax Call
                // Token Expired때 data가 가공이 될수 있음을 위해
                selfConfig.apidata = selfConfig.data;
                if (selfConfig.apidiv !== "file") {
                    $.ajax({
                        url: selfConfig.url,
                        type: selfConfig.type,
                        data: JSON.stringify(selfConfig.apidata),
                        async: selfConfig.async,
                        headers: selfConfig.headers,
                        contentType: "application/json",
                        dataType: selfConfig.dataType,
                        timeout: selfConfig.timeout,
                        beforeSend: (xhr) => {
                            this.beforeSend(xhr);
                        }
                    })
                    .done((result, textStatus, xhr) => {
                        return this.done(result, textStatus, xhr);
                    })
                    .fail((xhr, textStatus, thrownError) => {
                        return this.fail(xhr, textStatus, thrownError);
                    })
                    .always(() => {
                        return this.always();
                    });
                } else {
                    //--------------------------------------------
                    // multipart form parameter setting
                    //--------------------------------------------
                    let formData = new FormData($("#"+selfConfig.applyId)[0]);
                    let dataParam = selfConfig.data;
                    for(let key in dataParam) {
                        formData.append(key, dataParam[key]);
                    }
                    //--------------------------------------------
                    $.ajax({
                        url: selfConfig.url,
                        type: selfConfig.type,
                        data: formData,
                        enctype: 'multipart/form-data',
                        processData: false,
                        contentType: false,
                        cache: false,
                        timeout: selfConfig.timeout,
                        beforeSend: (xhr) => {
                            this.beforeSend(xhr);
                        }
                    })
                    .done((result, textStatus, xhr) => {
                        return this.done(result, textStatus, xhr);
                    })
                    .fail((xhr, textStatus, thrownError) => {
                        return this.fail(xhr, textStatus, thrownError);
                    })
                    .always(() => {
                        return this.always();
                    });
                }
            } else {    // 일반 Ajax Call
                $.ajax({
                    type: selfConfig.type,
                    url: selfConfig.url,
                    data: selfConfig.data,
                    async: selfConfig.async,
                    dataType: selfConfig.dataType,
                    timeout: selfConfig.timeout,
                    beforeSend: (xhr) => {
                        this.beforeSend(xhr);
                    }
                })
                .done((result, textStatus, xhr) => {
                    return this.done(result, textStatus, xhr);
                })
                .fail((xhr, textStatus, thrownError) => {
                    return this.fail(xhr, textStatus, thrownError);
                })
                .always(() => {
                    return this.always();
                });
            }
        }
        // ajax api error function
        ajaxErrorFunc(xhr, textStatus, thrownError) {
            let selfConfig = this.config;
            let errorCode = $.constant.SUCCESS_CD;
            let message;

            if (xhr.status == 0) {
                message = 'Not connect. Verify Network.';
            } else if (xhr.status == 400) {
                message = 'Bad Request. [400]';
            } else if (xhr.status == 401) {
                let respJson = JSON.parse(xhr.responseText);
                message = respJson.resultMessage;
            } else if (xhr.status == 404) {
                message = 'Requested page not found. [404]';
            } else if (xhr.status == 500) {
                let respJson = JSON.parse(xhr.responseText);
                message = 'Internal Server Error [500]\n' + respJson.resultMessage;
            } else if (textStatus == 'parsererror') {
                message = 'Requested JSON parse failed.';
            } else if (textStatus == 'timeout') {
                message = 'Time out error.';
            } else if (textStatus == 'abort') {
                message = 'Ajax request aborted.';
            } else {
                message = 'Uncaught Error. ';
                if ($.ti.isJson(xhr.responseText)) {
                    let respJson = JSON.parse(xhr.responseText);
                    message += "\n" + respJson.error_message;
                    errorCode = respJson.error_code;
                }
            }
            if (!$.ti.isEmptyVal(message) && (xhr.status != 400 || errorCode == '403')) {
                $.tialert({
                    type:'error',
                    msg: message + "\n" + (xhr.status == 403 ? "The session has ended." :thrownError),
                    ok: function() {
                        // 잘못된 Token이면 메인화면으로 이동한다.
                        if (xhr.status == 401 || errorCode == '403' || xhr.status == 403 || xhr.status == 405) {
                            $.ti.formRedirect();
                        }
                    }
                });
            }
            return false;
        }
        beforeSend(xhr) {
            let selfConfig = this.config;
            if (selfConfig.isXsrf === true) {
                xhr.setRequestHeader(selfConfig.csrfHeader, selfConfig.csrfToken);
            }
            if (selfConfig.isloading) $.ti.preloading().then();
            if (typeof selfConfig.beforeSend === "function") {
                selfConfig.beforeSend.call(this, xhr);
            }
        }
        done(result, textStatus, xhr) {
            let selfConfig = this.config;
            if (selfConfig.isloadingend) $.ti.preloading(false).then();

            if (selfConfig.category !== "api") {
                if (!$.ti.isEmptyVal(result.error_code) && !$.ti.isEmptyVal(result.error_message) &&
                    (result.error_code == '455' || result.error_code == '456')) {
                    $.tialert({
                        type:'error',
                        msg: result.error_message,
                        ok: function() {
                            if (result.error_code == '455') $.ti.formRedirect();
                        }
                    });
                } else {
                    if (typeof selfConfig.success === "function") {
                        selfConfig.success.call(this, result, textStatus, xhr);
                    }
                }
            } else {
                if (!$.ti.isEmptyVal(result.resultCode) && !$.ti.isEmptyVal(result.resultMessage) &&
                    (result.resultCode == '455' || result.resultCode == '456' || result.resultCode == '457')) {
                    $.tialert({type:'error', msg: result.resultMessage });
                    return false;
                }
                if (!$.ti.isEmptyVal(result.error_code) && !$.ti.isEmptyVal(result.error_message)) {
                    $.tialert({type:'error', msg: result.error_message });
                    return false;
                }
                if (typeof selfConfig.success === "function") {
                    selfConfig.success.call(this, result, textStatus, xhr);
                }
            }
        }
        fail(xhr, textStatus, thrownError) {
            let selfConfig = this.config;
            $.ti.preloading(false).then();

            // 서버통신 오류 체크
            if (!this.ajaxErrorFunc(xhr, textStatus, thrownError)) {
                return false;
            }
            if (typeof selfConfig.error === "function") {
                selfConfig.error.call(this, xhr.responseJSON, textStatus, xhr);
            }
        }
        always() {
            let selfConfig = this.config;
            if (selfConfig.isloadingend) $.ti.preloading(false).then();

            // 에러 페이지를 설정한 경우 - user callback
            if (typeof selfConfig.complete === "function") {
                selfConfig.complete.call(this);
            }
        }
    }

    // jquery ajax function call
    $.tiAjax = function(options) {
        return new jqAjaxCall(options).init();
    };

})(jQuery);