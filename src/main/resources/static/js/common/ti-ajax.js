/*!
 * Ti Http Plugin
 * Copyright (C) 2025 by Taihoinst CO.,LTD. All right reserved.
 * Version: 2.0.0
 */
"use strict";

// tiHttpSend init data
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


// fetch function call
let tiHttpSend = (options) => {
    return new fetchCall(options);
};

// fetch Call 생성자
class fetchCall {
    constructor(options) {
        this.options = options;
        this.config = {};
        return this.init();
    }
    init() {
        this.config = tiUtil.extend(true, defaults, this.options);
        return this.tiFetchFunc();
    }
    /**
     * Statements category가 form, data인 경우 호출되는 내부함수 input의
     * name을 binding 하여 서버로 전송한다.
     */
    async tiFetchFunc() {
        let selfConfig = this.config;
        let data = {};

        //--------------------------------------------
        // form element parameter setting
        //--------------------------------------------
        if (selfConfig.category !== "param" && selfConfig.category === "api") {   // param이 아니면
            let applyDom = document.querySelectorAll(`#${selfConfig.applyId} input:not([type=button]),select`);
            applyDom.forEach(function(_obj, _i) {
                let _this = _obj;
                let _thisVal = _this.value;
                let _thisId = _this.getAttribute("id");
                let _thisName = _this.getAttribute("name");
                let _thisType = _this.getAttribute("type");
                let _thisPropTagName = _this.tagName;
                console.log(_thisId + " :: " + _thisName + " , " + _thisType + " , " + _thisName + " , " + _thisVal);
                // type이 checkbox
                if (_thisType === "checkbox") {
                    // 선택되어 있으면
                    if (_this.checked) {
                        // 등록된 값이 없다면
                        if (typeof data[_thisName] === "undefined" || data[_thisName] === "") {
                            data[_thisName] = _thisVal;
                        } else {
                            data[_thisName] += ","+_thisVal;
                        }
                    }
                // type이 radio
                } else if (_thisType === "radio") {
                    // 선택되어 있으면
                    if (_this.checked) {
                        data[_thisName] = _thisVal;
                    }
                // type이 input, text area, select etc
                } else if (_thisPropTagName.toUpperCase() === "INPUT" || _thisPropTagName.toUpperCase() === "TEXTAREA") {
                    data[_thisName] = _thisVal;
                } else if (_thisPropTagName.toUpperCase() === "SELECT") {
                    let id_selected = document.querySelector(`#${_thisId}`).selectedIndex;
                    _thisVal = document.querySelector(`#${_thisId}`).options[id_selected].value;
                    data[_thisName] = _thisVal;
                }
            });
        }
        console.log("data", data);
        //--------------------------------------------

        //--------------------------------------------
        // 공통 parameter setting
        //--------------------------------------------
        selfConfig.data = tiUtil.extend(true, selfConfig.data, data);
        //--------------------------------------------

        if (selfConfig.category === "api") {
            selfConfig.apidata = selfConfig.data;
            // if (selfConfig.isloading) tiUtil.preloading(true).then();
            return await fetch(selfConfig.url, {
                        method: selfConfig.type,
                        headers: selfConfig.headers,
                        credentials: 'same-origin',
                        body: JSON.stringify(selfConfig.apidata)
                    }).then((response) => {
                        if (!response.ok) {
                            response.text().then(text => {
                                this.fail(`[status] : ${response.status}, [message] : ${text}`);
                            }).catch(error =>
                                this.fail(error)
                            );
                        } else {
                            response.json().then((data) => {
                                this.done(data);
                            });
                        }
                    }).catch(error => {
                        this.fail(error);
                    }).finally(() => {
                        this.always();
                    });
        }
    }
    done(result) {
        let selfConfig = this.config;
        if (selfConfig.isloadingend) tiUtil.preloading(false).then();
        if (typeof selfConfig.success === "function") {
            selfConfig.success.call(this, result);
        }
    }
    fail(result) {
        let selfConfig = this.config;
        tiUtil.preloading(false).then();
        if (typeof selfConfig.error === "function") {
            selfConfig.error.call(this, result);
        }
    }
    always() {
        let selfConfig = this.config;
        if (selfConfig.isloadingend) tiUtil.preloading(false).then();
        if (typeof selfConfig.complete === "function") {
            selfConfig.complete.call(this);
        }
    }
}
