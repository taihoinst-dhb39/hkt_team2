/*!
 * jQuery common Plugin
 * Copyright (C) 2022 by Taihoinst CO.,LTD. All right reserved.
 * Version: 1.2.0
 */
(function($, window, document) {
    "use strict";

    $.extend({

        ti : {

            /**
             * dimmed 설정
             */
            dimmedInit : function() {
                let inCss = "";
                inCss += "\n <style>";
                inCss += "\n     .layer {display:none; position:fixed; top:0; left:0; width:100%; height:100%; z-index:12000;}";
                inCss += "\n     .layer .bg {position:absolute; top:0; left:0; width:100%; height:100%; background:#000; opacity:.2; background-color:#000;}";
                inCss += "\n     .layer .pop-layer {display:block;}";
                inCss += "\n     .pop-layer {display:none; position: absolute; top: 50%; left: 50%; z-index: 10;}";
                inCss += "\n </style>";

                let inMsgCss = "";
                inMsgCss += "\n <style>";
                inMsgCss += "\n     .layermsgpop {display:none; position:fixed; top:0; left:0; bottom:0; width:100%; height:100%; z-index:12000;}";
                inMsgCss += "\n     .layermsgpop .msgbg {position:relative; top:0; left:0; width:100%; height:100%; background:#000; opacity:.2; background-color:#000;}";
                inMsgCss += "\n     .layermsgpop .popmsg-layer {display:block;}";
                inMsgCss += "\n     .popmsg-layer {display:none; position: absolute; top: 50%; left: 50%; width:900px; height:600px; background-color:#fff; border: 5px solid #3571B5; z-index: 10;}";
                inMsgCss += "\n     .popmsg-layer .popmsg-container {padding: 20px 25px;}";
                inMsgCss += "\n     .popmsg-layer div.ctxt {color: #666; line-height: 25px; overflow-y: scroll; min-height: 500px; font-size:12px; max-height: 500px; white-space: nowrap;}";
                inMsgCss += "\n     .popmsg-layer .btn-r {width: 100%; margin:10px 0 20px; padding-top: 10px; border-top: 1px solid #DDD; text-align:right;}";
                inMsgCss += "\n </style>";

                $('head').append(inCss + inMsgCss);

                let inHtml = "";
                inHtml += '\n <div class="layer">';
                inHtml += '\n     <div class="bg"></div>';
                inHtml += '\n     <div id="layerImg" class="pop-layer loader" />';
                inHtml += '\n </div>';

                $('body').append('<div id="layerPopup"></div><div id="layermsgpop"></div>');
                $('#layerPopup').html(inHtml);
            },

            /**
             * 부모창의 function을 호출한다.
             */
            openerFunctionCall : function( functionName, data ) {
                // 단건인 경우에는 배열에 담아 던진다.
                if (data.length == undefined) {
                    let retData = [];
                    retData.push(data);
                    if (typeof opener[functionName] === "function" || typeof opener[functionName] === "object") {
                        opener[functionName].call(this, retData);
                    } else {
                        $.tialert({msg: "The function to be called in the parent window is loaded." });
                    }
                } else {
                    if (typeof opener[functionName] === "function" || typeof opener[functionName] === "object") {
                        opener[functionName].call(this, data);
                    } else {
                        $.tialert({msg: "The function to be called in the parent window is loaded." });
                    }
                }
            },

            /**
             * 공통코드 조회
             *
             * @param obj
             * @returns {*[]}
             */
            getCommonCode : function(obj) {
                let comboList = [];
                if ($.isPlainObject(obj)) {
                    let cdGrp = obj.cdGrp;
                    let success = obj.success;
                    let error = obj.error;

                    let param = {
                        cdGrp : cdGrp,
                        paramLang : sessionStorage.getItem($.constant.USER_LANG)
                    };
                    $.tiAjax({
                        url: "/adm/web/selectCdComboList.do",
                        async: false,
                        data: param,
                        success: function(data) {
                            comboList = data.comboList;
                            if (typeof success === "function") {
                                success.call(this, data.comboList);
                                return false;
                            }
                            return comboList;
                        },
                        error: function(_data) {
                            if (typeof error === "function") {
                                error.call(this);
                                return false;
                            }
                        }
                    });
                }
                return comboList;
            },

            /**
             * codeList에서 특정 cdGrp를 추출
             *
             * @param obj
             * @returns {*[]}
             */
            setCodeData : function(obj) {
                let comboList = [];
                if ($.isPlainObject(obj)) {
                    let codeList = obj.codeList;
                    let cdGrp = obj.cdGrp;

                    comboList = $.grep(codeList, function (ele) {
                        return ele.cdGrp === cdGrp;
                    });
                    if (typeof obj.first !== "undefined") {
                        comboList = $.merge([{cd: '', cdNm: obj.first}], comboList);
                    }
                }
                return comboList;
            },

            /**
             * 공통코드 Combo List 조회
             * ex)
             * $.ti.setComboBox({
             *     tagId: ['langCd','tzonCd'],
             *     cdGrp: ['0010','0007'],
             *     first: ['',''],
             *     keySet: ['','cd:cdDesc']
             *     success: function() {
             *         $('#langCd').val('${userInfo.langCd}').prop("selected", true);
             *         $('#tzonCd').val('${userInfo.tzonCd}').prop("selected", true);
             *     }
             * });
             *
             * @param obj
             */
            setComboBox : function(obj) {
                let comboList = [];
                if ($.isPlainObject(obj)) {
                    let codeList = obj.codeList;
                    let tagId = obj.tagId;
                    let cdGrp = obj.cdGrp;
                    let first = obj.first;
                    // 'cd:cdDesc' 사용. 기본은 'cd:cdNm'
                    let keySet = !$.ti.isEmptyVal(obj.keySet)?obj.keySet:'';
                    let success = obj.success;
                    let error = obj.error;
                    let arrKeySet = [];

                    tagId.forEach((item, idx) => {
                        let _item = $('#' + item);
                        _item.empty();
                        if (!$.ti.isEmptyVal(first[idx])) _item.append('<option value="">'+first[idx]+'</option>');
                    });
                    cdGrp.forEach((item, idx) => {
                        comboList = $.grep(codeList, function (ele) {
                            return ele.cdGrp == item;
                        });

                        if ($.isArray(keySet) || $.isPlainObject(keySet)) {
                            arrKeySet = keySet[idx] === '' ? 'cd:cdNm'.split(':') : keySet[idx].split(':');
                        } else {
                            arrKeySet = 'cd:cdNm'.split(':');
                        }
                        for (let o of comboList) {
                            // 검색 언어(0010)면 text에 코드를 보여준다.
                            if (item === '0010') {
                                $('#' + tagId[idx]).append('<option value="'+o[arrKeySet[0]]+'">'+o[arrKeySet[1]]+' ('+o[arrKeySet[0]]+')'+'</option>');
                            } else {
                                $('#' + tagId[idx]).append('<option value="'+o[arrKeySet[0]]+'">'+o[arrKeySet[1]]+'</option>');
                            }
                        }
                    });

                    if (typeof success === "function") {
                        success.call(this, codeList);
                        return false;
                    }
                    if (typeof error === "function") {
                        error.call(this);
                        return false;
                    }
                }
            },

            /**
             * 문자열 all trim
             */
            alltrim : function (value) {
                return value.replace(/\s/g, '');
            },

            /**
             * 특수문자 제거
             */
            specialCharRemove : function (value) {
                let regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
                return value.replace(regExp, "");
            },

            /**
             * 숫자여부 체크
             */
            isNumber : function (value) {
                return !isNaN(value);
            },

            /**
             * carriage return 제거
             */
            carriageReturnRemove : function (value) {
                let regExp = /\r?\n|\r/g;
                return value.replace(regExp, "");
            },

            /**
             * Carrige Return BR Tag Convert
             */
            replaceCarrigeBrAll : function (strVal) {
                if ($.ti.nvl(strVal) === '') return '';
                return strVal.toString().replace(/(\\r\\n|\\n|\\r)/gm, '<br/>').replace(/(\r\n|\n|\r)/gm, '<br/>');
            },

            /**
             * xss방지 특수문자 변환
             */
            escapeHtml: function (value) {
                let entityMap = {
                  '&': '&amp;',
                  '<': '&lt;',
                  '>': '&gt;',
                  '"': '&quot;',
                  "'": '&apos;',
                  "\n": '&lt;br/&gt;'
                };
                return typeof value === 'string' ? value.replace(/[&<>"'\n]/g, function (s) {
                    return entityMap[s];
                }) : value;
            },

            /**
             * html xss tag to html tag conversion
             */
            unescapeHtml : function (str) {
                if (str == null || typeof str === "undefined") {
                    return "";
                }
                return str.toString()
                   .replace(/&amp;/g, '&')
                   .replace(/&lt;/g, '<')
                   .replace(/&gt;/g, '>')
                   .replace(/&quot;/g, '"')
                   .replace(/&#34;/g, '"')
                   .replace(/&#034;/g, '"')
                   .replace(/&#039;/g, "'")
                   .replace(/&apos;/g, "'")
                   .replace(/&#39;/g, "'")
                   .replace(/&#44;/g, ",")
                   .replace(/&#184;/g, ",")
                   .replace(/alert/g, "")
                   .replace(/script/g, "")
                   .replace(/javascript/g, "");
            },

            /**
             * 천단위 콤마 추가
             */
            addComma : function (value) {
                if ($.ti.nvl(value) === '') return '0';
                return value.toString().replace(/\,/g, '').replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
            },

            /**
             * 문자열 substring
             */
            substring : function (value, from, to) {
                if ($.ti.nvl(value) === '') return '';
                return value.substring(from, to);
            },

            /**
             * 한글인지 아닌지 체크하여 바이트를 넘겨준다.
             */
            chr_byte : function (chr) {
                if (escape(chr).length > 4) return 2;
                else return 1;
            },

            /**
             * UTF8 입력값 길이 체크
             */
            getByteLengthOfString : function(s, b, i, c) {
                for (b = i = 0; c = s.charCodeAt(i++); b += c >> 11 ? 3 : c >> 7 ? 2 : 1);
                return b;
            },

            /**
             * 한글 제목 길이 자르기
             *
             * Statements $.ti.curString(content, 50);
             */
            curString : function (str, limit) {
                let tmpStr = str;
                let byte_count = 0;
                let len = str.length;
                let dot = "";

                for (let i = 0; i < len; i++) {
                    byte_count += $.ti.chr_byte(str.charAt(i));
                    if (Number(byte_count) === Number(limit) - 1) {
                        if (Number($.ti.chr_byte(str.charAt(i + 1))) === 2) {
                            tmpStr = str.substring(0, i + 1);
                            dot = "...";
                        } else {
                            if (i + 2 !== len) dot = "...";
                            tmpStr = str.substring(0, i + 2);
                        }
                        break;
                    } else if (Number(byte_count) === Number(limit)) {
                        if (i + 1 !== len) dot = "...";
                        tmpStr = str.substring(0, i + 1);
                        break;
                    }
                }

                return tmpStr + dot;
            },

            /**
             * jquery layer dialog 전 세션 체크
             */
            dialog : function (obj) {
                if ($.isPlainObject(obj)) {
                    let ifrmDlg = $.ti.nvl(obj.ifrmDlg, '');
                    let title = $.ti.nvl(obj.title, '');
                    let _url = $.ti.nvl(obj.url, '');
                    let modal = typeof obj.modal !== "undefined" ? obj.modal : true;
                    let width = $.ti.nvl(obj.width, '');
                    let height = $.ti.nvl(obj.height, '');
                    let _params = $.ti.nvl(obj.params, '');

                    $.tiAjax({
                        url: "/adm/web/sessChk.do",
                        data: {},
                        isloading: false,
                        success: function () {
                            $.ti.doDialog({
                                ifrmDlg: ifrmDlg,
                                title: title,
                                url: _url,
                                modal: modal,
                                width: width,
                                height: height,
                                params: _params
                            });
                            $.ti.submitDynamicForm({
                                formId: ifrmDlg + "form1",
                                action: _url,
                                method: 'post',
                                params: _params,
                                targetId: ifrmDlg + "Iframe"
                            });
                        },
                        error: function (result, status, error) {
                            $.tialert({msg: "[code : " + result.status + "]\r\n" + result.responseText + "\r\n" + error});
                            return false;
                        }
                    });
                }
            },

            /**
             * jquery layer dialog
             */
            doDialog : function (obj) {
                if ($.isPlainObject(obj)) {
                    let win = $(window);

                    let ifrmDlg = $.ti.nvl(obj.ifrmDlg, '');
                    let title = $.ti.nvl(obj.title, '');
                    let modal = typeof obj.modal !== "undefined" ? obj.modal : true;
                    let width = $.ti.nvl(obj.width, '0');
                    let height = win.height() - 130;

                    $('#' + ifrmDlg).remove();
                    $('body').append('<div id="' + ifrmDlg + '" style="border:none; padding:0; margin:0; vertical-align:top;">' +
                    '<iframe id="' + ifrmDlg + 'Iframe" name="' + ifrmDlg + 'Iframe" src="" style="border:none; width:' + (width - 6) + 'px; height:100%; padding:0; margin:0; float:left; line-height:100%;">' +
                    '</iframe></div>');
                    let iframe = $('#' + ifrmDlg).dialog({
                        title: title,
                        bgiframe: true,
                        autoOpen: true,
                        draggable: true,
                        width: width,
                        height: height,
                        modal: modal,
                        closeOnEscape: true,
                        show: 'slide',
                        hide: 'explode',
                        resizable: false,
                        autoResize: true,
                        dialogClass: 'dialogWithDropShadow',
                        create: function (e, _ui) {
                            $(e.target).parent().css('position', 'fixed');
                        },
                        open: function () {
                            let win = $(window);
                            $(this).parent().css({
                                positon: 'absolute',
                                border: 'none',
                                left: ((win.width() - $(this).parent().outerWidth()) / 2) + 10,
                                top: ((win.height() - $(this).parent().outerHeight()) / 2) - 20,
                                zIndex: 999
                            });
                        },
                        close: function () {
                            $(this).remove();
                        }
                    }).width(width).height(height);

                    iframe.parent().find('.ui-dialog-content').css('padding', '0');

                    return iframe;
                }
            },

            /**
             * dimm block 처리
             * @returns {Promise<unknown>}
             */
            dimmBlock : function () {
                return new Promise(() => {
                    setTimeout(() => {
                        $('.layer').fadeIn(100);
                    }, 50);
                });
            },

            /**
             * dimm unblock 처리
             * @returns {Promise<unknown>}
             */
            dimmUnBlock : function () {
                return new Promise(() => {
                    setTimeout(() => {
                        $('.layer').fadeOut(100);
                    }, 50);
                });
            },

            /**
             * ajax요청 및 종료 시 로딩 Display
             */
            preloading : async function (bln) {
                if (typeof bln == "undefined" || bln == null || Boolean(bln)) {
                    await top.$.ti.dimmBlock();
                } else {
                    await top.$.ti.dimmUnBlock();
                }
            },

            /**
             * 비동기 function call 시 preloading 출력
             */
            preFuncloading : function(callback, param) {
                let deferred = $.Deferred();
                if (typeof(callback) === "function") {
                    setTimeout(function () {
                        if (!$.ti.isEmptyVal(param)) {
                            deferred.resolve(callback.call(this, param));
                        } else {
                            deferred.resolve(callback.call(this));
                        }
                    }, 200);
                    return deferred.promise();
                }
            },

            /**
             * 비동기 function call
             * ex)
             *     var param = {};
             *     $.ti.asyncFunctionCall(dataDetailCalculatSub, param);
             */
            asyncFunctionCall : function(funcName, param) {
                $.ti.preloading().then();
                $.when($.ti.preFuncloading(funcName, param)).done(function() {
                    $.ti.preloading(false).then();
                }).fail(function(error) {
                    alert(error);
                });
            },

            /**
             * 빈 값 체크
             */
            isEmptyVal : function(o) {
                if (typeof o == "undefined" || $.trim(o) == "") return true;
                else return typeof o == "object" && o == {};
            },

            /**
             * undefined 체크 공백 리턴
             */
            checkNULL : function(o) {
                if (typeof o == "undefined" || $.trim(o) == "" || o == null || o == "undefined") return "";
                if (typeof o == "undefined" || $.trim(o) == "" || $.trim(o) == "null" || o == null || o == "undefined") return "";
                else return o;
            },

            /**
             * undefined 체크 공백 및 초기값 리턴
             */
            nvl : function(o, v) {
                if (typeof v == "undefined") return $.ti.checkNULL(o);
                if ($.ti.checkNULL(o) == "") return v;
                else return o;
            },

            /**
             * email 정합성 체크
             * @param email_addr
             * @returns {boolean}
             */
            emailCheck : function(email_addr) {
                let sVar = email_addr;
                return !(sVar.indexOf("@") < 0 || sVar.indexOf(".") < 0);
            },

            /**
             * 특정 날짜에 대해 지정한 값만큼 가감(+-)한 날짜를 반환
             *
             * 입력 파라미터
             *     pInterval : "yyyy" 는 연도 가감, "m" 은 월 가감, "d" 는 일 가감
             *     pAddVal : 가감 하고자 하는 값 (정수형) pYyyymmdd : 가감의 기준이 되는 날짜
             *     pDelimiter : pYyyymmdd 값에 사용된 구분자를 설정 (없으면 "" 입력)
             *
             * 반환값 ---- yyyymmdd 또는 함수 입력시 지정된 구분자를 가지는 yyyy?mm?dd 값
             *
             * 사용예 --- 2008-01-01 에 3 일 더하기 ==> addDate("d", 3, "2008-01-01", "-"); ==> 20080301
             *           2008-01-01 에 8 개월 더하기 ==> addDate("m", 8, "20080101", ""); ==> 20080901
             *
             * @param pInterval
             * @param pAddVal
             * @param pYyyymmdd
             * @param pDelimiter
             * @returns {string|*}
             */
            addDate : function(pInterval, pAddVal, pYyyymmdd, pDelimiter) {
                try {
                    let yyyy;
                    let mm;
                    let dd;
                    let cDate;
                    let cYear, cMonth, cDay;
                    let replDelimiter = new RegExp(pDelimiter, "g");

                    if (pDelimiter !== "") {
                        pYyyymmdd = pYyyymmdd.replace(replDelimiter, "");
                    }

                    yyyy = pYyyymmdd.substring(0, 4);
                    mm = pYyyymmdd.substring(4, 6);
                    dd = pYyyymmdd.substring(6, 8);

                    if (pInterval === "yyyy") {
                        yyyy = (yyyy * 1) + (pAddVal * 1);
                    } else if (pInterval === "m") {
                        mm = (mm * 1) + (pAddVal * 1);
                    } else if (pInterval === "d") {
                        dd = (dd * 1) + (pAddVal * 1);
                    }

                    // 12월, 31일을 초과하는 입력값에 대해 자동으로 계산된 날짜가 만들어짐.
                    cDate = new Date(yyyy, mm - 1, dd);
                    cYear = cDate.getFullYear();
                    cMonth = cDate.getMonth() + 1;
                    cDay = cDate.getDate();

                    cMonth = cMonth < 10 ? "0" + cMonth : cMonth;
                    cDay = cDay < 10 ? "0" + cDay : cDay;

                    if (pDelimiter !== "") {
                        return cYear + pDelimiter + cMonth + pDelimiter + cDay;
                    } else {
                        return cYear + cMonth + cDay;
                    }
                } catch (e) {
                    return "";
                }
            },

            /**
             * 동적 Form을 생성 Post방식으로 전송
             */
            submitDynamicForm : function(obj) {
                if ($.isPlainObject(obj)) {
                    let formId = $.ti.nvl(obj.formId, '');
                    let action = $.ti.nvl(obj.action, '');
                    let method = $.ti.nvl(obj.method, '');
                    let params = $.ti.nvl(obj.params, '');
                    let targetId = $.ti.nvl(obj.targetId, '');
                    let isSelf = typeof obj.isSelf !== "undefined" ? obj.isSelf : true;

                    // page 호출 시 loading bar 출력
                    $.ti.preloading(true).then();

                    let form = $('form[id=' + formId + ']');
                    if (form.length == 0) {
                        form = $(document.createElement('form'))
                            .attr('id', formId)
                            .attr('name', formId)
                            .attr('action', action)
                            .attr('method', method);
                        if (targetId != null && typeof targetId != "undefined" && targetId !== '') {
                            form.attr('target', targetId);
                        }
                        $('body').append(form);
                    }
                    form.empty();
                    if ($.constant.IS_XSRF === true)
                        form.append(`<input type="hidden" name="_csrf" value="${$.constant.CSRF_TOKEN}"/>`);

                    // 파라미터 Object로 Form에 hidden필드를 생성
                    for (let name in params) {
                        let valstr = params[name];
                        if ($.isArray(valstr) || $.isPlainObject(valstr)) {
                            valstr = JSON.stringify(valstr);
                        }
                        if (!$.constant.SESS_STORAGE_FRM_PARAM.includes(name)) {
                            form.append('<input type="hidden" name=\'' + name + '\' value=\'' + valstr + '\' />');
                        }
                    }
                    $.constant.SESS_STORAGE_FRM_PARAM.forEach((sessParam) => {
                        form.append('<input type="hidden" name="' + sessParam + '" value=\'' + $.ti.nvl(sessionStorage.getItem(sessParam)) + '\' />');
                    });

                    // Form Submit
                    if (parent) {
                        if (!isSelf && isSelf !== undefined && typeof isSelf != "undefined" && isSelf != null) {
                            form.attr('target', '_parent');
                        }
                        form.submit();
                    } else {
                        form.submit();
                    }

                    // dynamic form remove
                    form.remove();
                }
            },

            /**
             * Form을 Post방식으로 전송 전 세션 체크
             */
            windowOpenInPost : function(obj) {
                if ($.isPlainObject(obj)) {
                    let sesschk = $.ti.nvl(obj.sesschk, 'Y');

                    if (sesschk === 'Y') {
                        $.tiAjax({
                            url: "/adm/web/sessChk.do",
                            data: {},
                            isloading: false,
                            success: function () {
                                $.ti.doWindowOpenInPost(obj);
                            },
                            error: function (result) {
                                $.tialert({msg: "[code : " + result.status + "]\r\n" + result.responseText});
                                return false;
                            }
                        });
                    } else {
                        $.ti.doWindowOpenInPost(obj);
                    }
                }
            },

            /**
             * Form을 Post방식으로 전송
             */
            doWindowOpenInPost : function(obj) {
                if ($.isPlainObject(obj)) {
                    let formId = $.ti.nvl(obj.formId, '');
                    let action = $.ti.nvl(obj.action, '');
                    let method = $.ti.nvl(obj.method, '');
                    let width = $.ti.nvl(obj.width, 0);
                    let height = $.ti.nvl(obj.height, 0);
                    let targetId = $.ti.nvl(obj.targetId, '');
                    let windowFeatures = $.ti.nvl(obj.windowFeatures, '');
                    let params = obj.params;

                    let form = $('form[id=' + formId + ']');
                    if (form.length === 0) {
                        form = $(document.createElement('form'))
                            .attr('id', formId)
                            .attr('name', formId)
                            .attr('action', action)
                            .attr('method', method);
                        if (targetId != null && typeof targetId != "undefined") {
                            form.attr('target', targetId);
                        }
                        $('body').append(form);
                    }
                    form.empty();
                    if ($.constant.IS_XSRF === true)
                        form.append(`<input type="hidden" name="_csrf" value="${$.constant.CSRF_TOKEN}"/>`);

                    // 파라미터 Object로 Form에 hidden필드를 생성
                    for (let name in params) {
                        let valstr = params[name];
                        if ($.isArray(valstr) || $.isPlainObject(valstr)) {
                            valstr = JSON.stringify(valstr);
                        }
                        if (!$.constant.SESS_STORAGE_FRM_PARAM.includes(name)) {
                            form.append('<input type="hidden" name=\''+name+'\' value=\''+valstr+'\' />');
                        }
                    }
                    $.constant.SESS_STORAGE_FRM_PARAM.forEach((sessParam) => {
                        form.append('<input type="hidden" name="'+sessParam+'" value=\'' + $.ti.nvl(sessionStorage.getItem(sessParam)) + '\' />');
                    });

                    // 화면 중앙에 배치
                    let winl = screen.width / 2;
                    let wint = screen.height / 2;
                    winl -= (width / 2);
                    wint -= (height / 2);
                    windowFeatures = windowFeatures + ",width=" + width + ",height=" + height + ",top=" + wint + ",left=" + winl;
                    let map = window.open('', targetId, windowFeatures);
                    if (map) {
                        form.submit();
                    }
                    form.remove();
                }
            },

            /**
             * ui layout의 height 변경
             */
            setHeight : function(uiLayoutId) {
                let cHeight = 60;
                let c = $(uiLayoutId);
                let newHeight = $(window).height() - cHeight;
                c.height(newHeight);
            },

            /**
             * browser inner size 조회
             */
            getBrowserDim: function() {
                if (window.innerHeight) {
                    return { w: window.innerWidth, h: window.innerHeight };
                } else {
                    return { w: document.body.clientWidth, h: document.body.clientHeight };
                }
            },

            /**
             * 이벤트를 일정한 주기마다 발생
             * @param fn
             * @param threshhold
             * @param scope
             * @returns {(function(): void)|*}
             */
            throttle : function (fn, threshhold, scope) {
                threshhold || (threshhold = 200);
                let last,
                    deferTimer;
                return function () {
                    let context = scope || this;

                    let now = +new Date, args = arguments;
                    if (last && now < last + threshhold) {
                        // hold on to it
                        clearTimeout(deferTimer);
                        deferTimer = setTimeout(function () {
                            last = now;
                            fn.apply(context, args);
                        }, threshhold);
                    } else {
                        last = now;
                        fn.apply(context, args);
                    }
                };
            },

            /**
             * 연이어 호출되는 함수들 중 마지막 함수(또는 제일 처음)만 호출
             * @param fn
             * @param delay
             * @returns {(function(): void)|*}
             */
            debounce : function (fn, delay) {
                delay || (delay = 200);
                let timer = null;
                return function () {
                    let context = this, args = arguments;
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        fn.apply(context, args);
                    }, delay);
                };
            },

            /**
             * json type check
             */
            isJson : function(str) {
                try {
                    JSON.parse(str);
                } catch (e) {
                    return false;
                }
                return true;
            },

            /**
             * Xml type check
             */
            isXml : function(str) {
                try {
                    $.parseXML(str);
                } catch (e) {
                    return false;
                }
                return true;
            },

            /**
             * contents copy clipboard
             */
            copyToClipboard : async function(id) {
                let textToCopy = document.querySelector("#" + id).innerText;
                if ($.ti.isJson(textToCopy)) {
                    textToCopy = JSON.stringify(JSON.parse(textToCopy), null, 2);
                }
                await navigator.clipboard.writeText(textToCopy).then(
                    function() {
                        /* clipboard successfully set */
                        window.$.tialert({msg: 'Success! The text was copied to your clipboard' });
                    },
                    function() {
                        /* clipboard write failed */
                        window.$.tialert({msg: 'Opps! Your browser does not support the Clipboard API' });
                    }
                );
            },

            /**
             * form 정보를 JsonObject로 변환
             */
            formToJson : function(formId) {
                let data = {};

                $("#"+formId+" :input[type != button]").each(function(_i, _obj) {
                    let _this = $(this);
                    let _thisVal = $(this).val();
                    // type이 checkbox
                    if ($(this).attr("type") === "checkbox" || $(this).attr("type") === "radio") {
                        // 선택되어 있으면
                        if ($(this).is(":checked")) {
                            data[$(this).attr("name")] = _thisVal;
                        }
                    // type이 input, text area, select etc
                    } else if ($(this).prop("tagName").toUpperCase() === "INPUT" || $(this).prop("tagName").toUpperCase() === "TEXTAREA") {
                        data[$(this).attr("name")] = _thisVal;
                    } else if ($(this).prop("tagName").toUpperCase() === "SELECT") {
                        let _thisId = _this.attr("id");
                        _thisVal = $('#' + _thisId + ' option:selected').val();
                        data[$(this).attr("name")] = _thisVal;
                    }
                });

                return data;
            },

            /**
             * jsonData를 formId에 매핑시켜 하위 요소들에 값들을 세팅한다.
             * radio는 id가 서로 상이하고 name이 같기 때문에 이 메소드는 사용하지 않는다.
             *
             * ex) $.ti.jsonToFormId(data.menuMap, '#mainBody');
             */
            jsonToFormId : function(objData, formId) {
                $(formId + ' div, span').each(function(_idx, item) {
                    let itemId = $(item).attr("id");
                    if (itemId != null && typeof itemId != "undefined") {
                        let result = objData[itemId];
                        if (result != null && typeof result != "undefined") {
                            $(item).html($.ti.unescapeHtml(result));
                        }
                    }
                });
            },

            /**
             * checkbox value setting
             * @param formId
             * @param objData
             * @param key
             * @returns {[]}
             */
            getCheckBoxVal : function(formId, objData, key) {
                let checkBoxVal = [];
                $(formId+" :input[type != button]").each(function(_i, _obj) {
                    if ($(this).attr("type") === "checkbox" && $(this).attr("name") === key) {
                        if ($.trim(objData[key]) != '') {
                            checkBoxVal = objData[key].split(',');
                        }
                    }
                });
                return checkBoxVal;
            },

            /**
             * select, textarea value setting
             * @param formId
             * @param objData
             * @param key
             */
            setComboBoxVal : function(formId, objData, key) {
                let _this = $(formId).find('#'+key);
                try {
                    if (_this.length > 0) {
                        if (_this.get(0).nodeName === "select" || _this.get(0).nodeName === "SELECT") {
                            _this.val(objData[key]).attr("selected", "selected");
                        } else {
                            _this.val(objData[key]); // textarea
                        }
                    }
                } catch(e) {
                }
            },

            /**
             * jsonData를 formId에 매핑시켜 하위 요소들에 값들을 세팅한다.
             *
             * ex) $.ti.jsonToForm(data.menuMap, '#mainBody');
             */
            jsonToForm : function(objData, formId) {
                // Form에 값 세팅
                for (let key in objData) {
                    let _this = $(formId + ' input[name='+key+']');
                    let checkBoxVal = $.ti.getCheckBoxVal(formId, objData, key);
                    if (_this.attr('type') === null ||
                        _this.attr('type') === "undefined" ||
                        typeof _this.attr('type') === "undefined") {
                        $.ti.setComboBoxVal(formId, objData, key);
                    } else if (_this.attr('type') == 'radio') {
                        $(formId + ' input:radio[name='+key+']:input[value='+objData[key]+']').prop("checked", true);
                    } else if (_this.attr('type') == 'checkbox') {
                        for (let i = 0, len = checkBoxVal.length; i < len; i++) {
                            $(formId + ' input:checkbox[name='+key+']:input[value='+checkBoxVal[i]+']').prop("checked", true);
                        }
                    } else {
                        _this.val($.ti.unescapeHtml(objData[key]));
                    }
                }

                // div, span에 값 세팅
                $.ti.jsonToFormId(objData, formId);
            },

            /**
             * formId 하위 요소들을 enable, disable 시킨다.
             *
             * ex) $.ti.formAllEnableDisable('#mainBody' true|false);
             */
            formAllEnableDisable : function(formId, actionGubun) {
                $(formId + " :input, a").each(function(_i, _item) {
                    $(this).prop("disabled", (actionGubun === false ? "disabled" : ""));
                });
            },

            /**
             * formId 요소를 enable, disable 시킨다.
             *
             * ex) $.ti.formEnableDisable('#btn_insert' true|false);
             */
            formEnableDisable : function(formId, actionGubun) {
                $(formId).prop("disabled", (actionGubun === false ? "disabled" : ""));
            },

            /**
             * formId 하위 요소들을 readonly true|false 시킨다.
             *
             * ex) $.ti.formAllReadonly('#mainBody' true|false);
             */
            formAllReadonly : function(formId, actionGubun) {
                $(formId + " :input[type != button], a").each(function(_i, _obj) {
                    if ($(this).prop("tagName").toUpperCase() == "SELECT") {
                        $(this).prop("disabled", actionGubun);
                    } else if ($(this).attr("type") == "FILE" || $(this).attr("type") == "file") {
                        $(this).prop("disabled", actionGubun);
                    } else if ($(this).attr("type") == "CHECKBOX" || $(this).attr("type") == "checkbox") {
                        $(this).prop("disabled", actionGubun);
                    } else {
                        $(this).attr("readonly", actionGubun);
                    }
                });
            },

            /**
             * formId 하위 요소들을 clear 한다.
             *
             * ex) $.ti.formClear('#mainBody');
             */
            formClear : function(formId) {
                $(formId + " :input[type != button]").each(function(_i, _obj) {
                    if ($(this).prop("tagName").toUpperCase() == "SELECT") {
                        $('#' + this.id + ' option:first').prop("selected", true);
                    } else if ($(this).attr("type") == "CHECKBOX" || $(this).attr("type") == "checkbox") {
                        $(this).prop("checked", false);
                    } else {
                        $(this).val('');
                    }
                });
            },

            /**
             * formId 하위 요소들중 특정 element의 값을 세팅한다.
             *
             * ex) $.ti.formElementSetValue('#mainBody', elements);
             */
            formElementSetValue : function(formId, elements) {
                if (elements !== null) {
                    $(formId + " :input[type != button]").each(function(_i, _obj) {
                        let objId = $(this).attr('id');
                        if (elements.hasOwnProperty(objId)) {
                            $(this).val($.ti.unescapeHtml(elements[objId]));
                        }
                    });
                }
            },

            /**
             * root context로 이동한다.
             */
            formRedirect : function() {
                // token 값 clear
                setTimeout(() => {
                    sessionStorage.clear();
                }, 100);

                //호출된 현재창이 팝업 상태이면
                if (opener) {
                    opener.top.location.href = "/adm/login.do";
                    self.close();
                //호출된 현재창이 iframe 이면
                } else if (parent && parent != this) {
                    opener = self;
                    self.close();
                    try {
                        if (parent.parent && parent.parent != this) {
                            try {
                                parent.parent.top.location.href = "/adm/login.do";
                            } catch (e) {}
                        } else {
                            parent.top.location.href = "/adm/login.do";
                        }
                    } catch(e) { }
                //호출된 현재창이 일반 Page 이면
                } else {
                    top.location.href = "/adm/login.do";
                }
            },

            /**
             * Json VIew Layer Popup
             */
            layer_open: function(data) {
                if (typeof data === "undefined") return;
                $.ti.asyncFunctionCall($.ti.layer_open_async, data);
            },

            /**
             * Async Layer Popup
             */
            layer_open_async: function(data) {
                if (typeof data === "undefined") return;
                let fadeVal = 350;
                let target_layer = top;
                let inPopHtml = "";
                inPopHtml += '\n <div class="layermsgpop">';
                inPopHtml += '\n     <div class="msgbg"></div>';
                inPopHtml += '\n     <div id="popmsglayer" class="popmsg-layer shadow-lg bg-body rounded">';
                inPopHtml += '\n         <div class="popmsg-container">';
                inPopHtml += '\n             <div class="pop-conts">';
                inPopHtml += '\n                 <div class="ctxt" id="popLayerMsg"></div>';
                inPopHtml += '\n                 <div class="btn-r">';
                inPopHtml += '\n                     <a href="javascript:" id="cbtn" class="rounded btn btn-primary btn-sm">Close</a>';
                inPopHtml += "\n                 </div>";
                inPopHtml += "\n             </div>";
                inPopHtml += "\n         </div>";
                inPopHtml += "\n     </div>";
                inPopHtml += "\n </div>";
                target_layer.$('#layermsgpop').html(inPopHtml);
                target_layer.$("#popLayerMsg").html(data);

                let layerId = target_layer.$("#popmsglayer");
                let isbg = layerId.prev().hasClass("msgbg");
                isbg ? target_layer.$(".layermsgpop").fadeIn(fadeVal) : layerId.fadeIn(fadeVal);
                layerId.outerHeight() < $(document).height() ? layerId.css("margin-top", "-" + layerId.outerHeight() / 2 + "px") : layerId.css("top", "0px");
                layerId.outerWidth() < $(document).width() ? layerId.css("margin-left", "-" + layerId.outerWidth() / 2 + "px") : layerId.css("left", "0px");
                layerId.find("#cbtn").on('click', function(e) {
                    target_layer.$('#popLayerMsg').empty();
                    isbg ? target_layer.$(".layermsgpop").fadeOut(fadeVal) : layerId.fadeOut(fadeVal);
                    e.preventDefault();
                });
                target_layer.$(".layermsgpop .msgbg").on('click', function(e) {
                    target_layer.$('#popLayerMsg').empty();
                    target_layer.$(".layermsgpop").fadeOut(fadeVal);
                    e.preventDefault();
                });
            },

            /**
             * Json VIew Layer Popup
             */
            json_view_layer_open: function(data) {
                if (typeof data === "undefined") return;
                $.ti.asyncFunctionCall($.ti.json_view_layer_open_async, data);
            },

            /**
             * Async Json VIew Layer Popup
             */
            json_view_layer_open_async: function(data) {
                if (typeof data === "undefined") return;
                let fadeVal = 350;
                let target_layer = top;
                let inPopHtml = "";
                inPopHtml += '\n <div class="layermsgpop">';
                inPopHtml += '\n     <div class="msgbg"></div>';
                inPopHtml += '\n     <div id="popmsglayer" class="popmsg-layer shadow-lg bg-body rounded">';
                inPopHtml += '\n         <div class="popmsg-container">';
                inPopHtml += '\n             <div class="pop-conts">';
                inPopHtml += '\n                 <div class="ctxt" id="popLayerMsg"></div>';
                inPopHtml += '\n                 <div class="btn-r">';
                inPopHtml += '\n                     <a href="javascript:" id="cbtn-copy" class="rounded btn btn-secondary btn-sm">Log Copy</a>';
                inPopHtml += '\n                     <a href="javascript:" id="cbtn" class="rounded btn btn-primary btn-sm">Close</a>';
                inPopHtml += "\n                 </div>";
                inPopHtml += "\n             </div>";
                inPopHtml += "\n         </div>";
                inPopHtml += "\n     </div>";
                inPopHtml += "\n </div>";
                target_layer.$('#layermsgpop').html(inPopHtml);

                if ($.ti.isJson(data)) {
                    let parseJson = JSON.parse(data);
                    target_layer.$('#popLayerMsg').empty().jsonViewer(parseJson, {
                        collapsed: false,
                        rootCollapsable: false,
                        withQuotes: true,
                        withLinks: false
                    });
                } else if ($.ti.isXml(data)) {
                    target_layer.$('#popLayerMsg').empty().simpleXML({ xmlString: data });
                } else {
                    target_layer.$('#popLayerMsg').empty().html(data);
                }

                let layerId = target_layer.$("#popmsglayer");
                let isbg = layerId.prev().hasClass("msgbg");
                isbg ? target_layer.$(".layermsgpop").fadeIn(fadeVal) : layerId.fadeIn(fadeVal);
                layerId.outerHeight() < $(document).height() ? layerId.css("margin-top", "-" + layerId.outerHeight() / 2 + "px") : layerId.css("top", "0px");
                layerId.outerWidth() < $(document).width() ? layerId.css("margin-left", "-" + layerId.outerWidth() / 2 + "px") : layerId.css("left", "0px");
                layerId.find("#cbtn").on('click', function(e) {
                    target_layer.$('#popLayerMsg').empty();
                    isbg ? target_layer.$(".layermsgpop").fadeOut(fadeVal) : layerId.fadeOut(fadeVal);
                    e.preventDefault();
                });
                layerId.find("#cbtn-copy").on('click', function(e) {
                    target_layer.$.ti.copyToClipboard('popLayerMsg').then();
                    e.preventDefault();
                });
                target_layer.$(".layermsgpop .msgbg").on('click', function(e) {
                    target_layer.$('#popLayerMsg').empty();
                    target_layer.$(".layermsgpop").fadeOut(fadeVal);
                    e.preventDefault();
                });
            },

            /**
             * pwd pattern count
             * @param pwd
             * @returns {number}
             */
            pwPatternCount : function(pwd) {
                let engUpper = /[A-Z]/; //영대문자
                let engLower = /[a-z]/; //영소문자
                let numChar = /\d/;  //숫자
                let spcChar = /[^a-zA-Z0-9]/; //특수문자
                let patternCount = 0;

                if (engUpper.test(pwd)) { patternCount++; }
                if (engLower.test(pwd)) { patternCount++; }
                if (numChar.test(pwd)) { patternCount++; }
                if (spcChar.test(pwd)) { patternCount++; }

                return patternCount;
            },

            /**
             * 비밀번호 정합성 체크
             */
            pwConsistencyCheck: function(_userId, newPwd) {
                let pwd = newPwd;
                let sameChar = /(\w)\1\1\1/; //같은문자,숫자 반복문자(4회)
                let sameSpcChar = /([\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"])\1\1\1/; //같은 특수문자 반복(4회)
                let ctneNumChar = /(0123)|(1234)|(2345)|(3456)|(4567)|(5678)|(6789)|(7890)/; //연속된 숫자
                let ctneChar1 = /(qwer)|(wert)|(erty)|(rtyu)|(tyui)|(yuio)|(uiop)|(asdf)|(sdfg)|(fghj)|(ghjk)|(hjkl)|(zxcv)|(xcvb)|(cvbn)|(vbnm)/; //사용하기 쉬운문자(소문자)
                let ctneChar2 = /(QWER)|(WERT)|(ERTY)|(RTYU)|(TYUI)|(YUIO)|(UIOP)|(ASDF)|(SDFG)|(FGHJ)|(GHJK)|(HJKL)|(ZXCV)|(XCVB)|(CVBN)|(VBNM)/; //사용하기 쉬운문자(대문자)

                let patternCount = $.ti.pwPatternCount(pwd);

                return {
                        pwd: pwd,
                        sameChar: sameChar,
                        sameSpcChar: sameSpcChar,
                        ctneNumChar: ctneNumChar,
                        ctneChar1: ctneChar1,
                        ctneChar2: ctneChar2,
                        patternCount: patternCount
                    };
            },

            /**
             * 비밀번호 결과 체크
             * @param userId
             * @param validResult
             * @returns {*[]}
             */
            pwValidResult: function(userId, validResult) {
                let resultMsg = [];
                // 비밀번호로 사용하기에는 적합하지 않습니다.\n비밀번호 규칙에 맞지 않습니다.
                if (validResult.pwd.length < 12 || validResult.pwd.length > 20) { resultMsg.push('1'); }
                // 비밀번호로 사용하기에는 적합하지 않습니다.\n비밀번호 규칙에 맞지 않습니다.
                else if (validResult.patternCount < 3) { resultMsg.push('2'); }
                // 비밀번호로 사용하기에는 적합하지 않습니다.\n최소 12자리 이상, 최대 20자리 이하의 비밀번호로 구성되어야 합니다.
                else if (validResult.patternCount == 3 && validResult.pwd.length < 12) { resultMsg.push('3'); }
                // 비밀번호로 사용하기에는 적합하지 않습니다.\n최소 12자리 이상, 최대 20자리 이하의 비밀번호로 구성되어야 합니다.
                else if (validResult.patternCount > 3 && (validResult.pwd.length < 12 || validResult.pwd.length > 20)) { resultMsg.push('4'); }
                else if (validResult.sameChar.test(validResult.pwd)) { resultMsg.push('5'); }
                else if (validResult.sameSpcChar.test(validResult.pwd)) { resultMsg.push('6'); }
                else if (validResult.ctneNumChar.test(validResult.pwd)) { resultMsg.push('7'); }
                else if (validResult.ctneChar1.test(validResult.pwd)) { resultMsg.push('8'); }
                else if (validResult.ctneChar2.test(validResult.pwd)) { resultMsg.push('9'); }
                else if (validResult.pwd.search(userId) != -1) { resultMsg.push('10'); }

                return resultMsg;
            },

            /**
             * 허용되는 파일 확장자 체크
             */
            fileExtNotAllowCheck : function(fileName, secuExt) {
                if ($.ti.isEmptyVal(fileName)) return true;
                let fileExtension = ['jpeg', 'jpg', 'png', 'gif'];
                if (typeof secuExt != "undefined" && secuExt === true) $.merge(fileExtension, ['pem']);
                return $.inArray(fileName.split('.').pop().toLowerCase(), fileExtension);
            },

            /**
             * 이미지 파일 확장자 체크
             * @param fileName
             * @returns {boolean}
             */
            isImage : function(fileName) {
                const ext = ['.jpg', '.jpeg', '.bmp', '.gif', '.png'];
                return ext.some(el => fileName.endsWith(el));
            },

            /**
             * file to base64 string
             * @param file
             * @returns {Promise<unknown>}
             */
            getFileBase64String : function(file) {
                const reader = new FileReader();
                return new Promise((resolve, reject) => {
                    reader.onerror = () => { reader.abort(); reject(new Error("Error parsing file"));}
                    reader.onload = function () {
                        let bytes = Array.from(new Uint8Array(this.result));
                        let base64StringFile = btoa(bytes.map((item) => String.fromCharCode(item)).join(""));
                        resolve({
                            bytes,
                            base64StringFile,
                            fileName: file.name,
                            fileType: file.type
                        });
                    }
                    reader.readAsArrayBuffer(file);
                });
            },

            /**
             * display total count
             */
            dispTotalCnt : function(objData) {
                if ($.type(objData) === "array") {
                    objData.forEach((obj) => {
                        let totCntMsg = obj.msg;
                        let totCnt = obj.cnt;
                        totCntMsg = totCntMsg.replace('#args', $.ti.addComma(totCnt));
                        $(obj.id).text(totCntMsg);
                    });
                } else if ($.isPlainObject(objData)) {
                    let totCntMsg = objData.msg;
                    let totCnt = objData.cnt;
                    totCntMsg = totCntMsg.replace('#args', $.ti.addComma(totCnt));
                    $(objData.id).text(totCntMsg);
                }
            },

            /**
             * Json key rename
             * @param obj
             * @param oldObj
             * @param newObj
             */
            renameJsonKey : function (obj, oldObj, newObj) {
                let cdCodeConv = [];
                for (let i = 0; i < obj.length; i++) {
                    let items = obj[i];
                    let convCdCodeObj = {};
                    oldObj.forEach((item, idx) => {
                        let newKey = newObj[idx];
                        convCdCodeObj[newKey] = items[item];
                    });
                    cdCodeConv.push(convCdCodeObj);
                }
                return cdCodeConv;
            },

            /**
             * Set SelectBox
             */
            setSelectBox : function(obj) {
                let elementId = obj.elementId;
                let selectBoxData = obj.selectBoxData;
                let selectedValue = obj.selectedValue;
                let arrKeySet = obj.arrKeySet.split(':');
                let callback = obj.callback;

                let _cdDesc = "";
                let _elementId = $('#' + elementId);
                _elementId.empty();
                selectBoxData.forEach((item, idx) => {
                    if (arrKeySet.length === 3) {
                        _cdDesc = ` (${item[arrKeySet[2]]})`;
                    } else {
                        _cdDesc = '';
                    }
                    if (!$.ti.isEmptyVal(selectedValue) && item[arrKeySet[0]] == selectedValue) {
                        _elementId.append(`<option value="${item[arrKeySet[0]]}" title="${item[arrKeySet[0]]}" driver-type-cd="${item.driverTypeCd}" selected>${item[arrKeySet[1]]}${_cdDesc}</option>`);
                    } else {
                        _elementId.append(`<option value="${item[arrKeySet[0]]}" title="${item[arrKeySet[0]]}" driver-type-cd="${item.driverTypeCd}">${item[arrKeySet[1]]}${_cdDesc}</option>`);
                    }
                });

                if (typeof callback === "function") {
                    callback.call(this);
                    return false;
                }
            },

            /**
             * 기간 중복 여부
             * @param fromYmd
             * @param toYmd
             * @param tarFromYmd
             * @param tarToYmd
             * @returns {boolean}
             */
            isPeriodDupDate : function(fromYmd, toYmd, tarFromYmd, tarToYmd) {
                let retVal = true;
                if ((tarFromYmd <= fromYmd && fromYmd <= tarToYmd) ||
                    (tarFromYmd <= toYmd && toYmd <= tarToYmd) ||
                    fromYmd <= tarFromYmd ||
                    toYmd <= tarFromYmd || toYmd <= tarToYmd) {
                    retVal = true;  // 중복
                } else {
                    retVal = false;  // 중복되지 않음
                }
                return retVal;
            }
        }

    });

})(jQuery, window, document);
