/*!
 * ti common Plugin
 * Copyright (C) 2025 by Taihoinst CO.,LTD. All right reserved.
 * Version: 2.0.0
 */
"use strict";

//const rtrim = /^[\s\uFEFF\xA0]+|([^\s\uFEFF\xA0])[\s\uFEFF\xA0]+$/g;
const tiUtil = {

    rtrim : /^[\s\uFEFF\xA0]+|([^\s\uFEFF\xA0])[\s\uFEFF\xA0]+$/g,

    /**
     * util initialize
     */
    init : () => {
        tiUtil.formInit();
        tiUtil.dimmedInit();
    },

    /**
     * form init
     */
    formInit : () => {
        // input text 전체 select range 세팅
        let inputText = document.querySelectorAll('input[type=text]');
        inputText.forEach((a) => {
            a.addEventListener('focus', (e) => {
                a.addEventListener('mouseup', (e) => {
                    a.select();
                    return false;
                }, { once: true });
                e.preventDefault();
            });
        });
    },

    /**
     * dimmed 설정
     */
    dimmedInit : () => {
        let inCss = "";
        inCss += "\n <style>";
        inCss += "\n     .layer {display:none; position:fixed; top:0; left:0; width:100%; height:100%; z-index:12000;}";
        inCss += "\n     .layer .bg {position:absolute; top:0; left:0; width:100%; height:100%; background:#000; background-color:#000;}";
        inCss += "\n     .layer .pop-layer {display:block;}";
        inCss += "\n     .pop-layer {display:none; position: absolute; top: 50%; left: 50%; z-index: 10;}";
        inCss += "\n </style>";
        document.head.insertAdjacentHTML('beforeend', inCss);

        let inHtml = "";
        inHtml += '\n<div id="layerPopup">';
        inHtml += '\n     <div class="layer" id="spin-layer">';
        inHtml += '\n         <div class="bg"></div>';
        inHtml += '\n         <div id="layerImg" class="pop-layer loader" />';
        inHtml += '\n     </div>';
        inHtml += '\n</div>';
        document.body.insertAdjacentHTML('beforeend', inHtml);
    },

    /**
     * dimm block 처리
     */
    dimmBlock : () => {
        return new Promise(() => {
            setTimeout(() => {
                tiUtil.fadeIn(document.getElementById("spin-layer"), true);
            }, 50);
        });
    },

    /**
     * dimm unblock 처리
     */
    dimmUnBlock : () => {
        return new Promise(() => {
            setTimeout(() => {
                tiUtil.fadeOut(document.getElementById("spin-layer"), true);
            }, 50);
        });
    },

    /**
     * fetch 요청 및 종료 시 로딩 Display
     * @param bln
     */
    preloading : async (bln = true) => {
        if (typeof bln == "undefined" || bln == null || Boolean(bln)) {
            await tiUtil.dimmBlock();
        } else {
            await tiUtil.dimmUnBlock();
        }
    },

    /**
     * element fade in
     * @param el
     * @param smooth
     * @param displayStyle
     */
     fadeIn : (el, smooth = true, displayStyle = 'block') => {
        el.style.opacity = 0;
        el.style.display = displayStyle;
        if (smooth) {
            let opacity = 0;
            let request;
            const animation = () => {
                el.style.opacity = opacity += 0.04;
                if (opacity >= 1) {
                    opacity = 1;
                    cancelAnimationFrame(request);
                }
            };
            const rAf = () => {
                request = requestAnimationFrame(rAf);
                animation();
            };
            rAf();
        } else {
            el.style.opacity = 1;
        }
    },

    /**
     * element fade out
     * @param el
     * @param smooth
     * @param displayStyle
     */
    fadeOut : (el, smooth = true, displayStyle = 'none') => {
        if (smooth) {
            let opacity = el.style.opacity;
            let request;
            const animation = () => {
                el.style.opacity = opacity -= 0.04;
                if (opacity <= 0) {
                    opacity = 0;
                    el.style.display = displayStyle;
                    cancelAnimationFrame(request);
                }
            };
            const rAf = () => {
                request = requestAnimationFrame(rAf);
                animation();
            };
            rAf();
        } else {
            el.style.opacity = 0;
        }
    },

    /**
     * object deep copy
     * @param args
     * @returns {{}}
     */
    extend : (...args) => {
        // Variables
        let extended = {};
        let deep = false;
        let i = 0;
        let length = args.length;

        // Check if a deep merge
        if ( Object.prototype.toString.call( args[0] ) === '[object Boolean]' ) {
            deep = args[0];
            i++;
        }

        // Merge the object into the extended object
        let merge = (obj) => {
            for ( let prop in obj ) {
                if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
                    // If deep merge and property is an object, merge properties
                    if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
                        extended[prop] = tiUtil.extend( true, extended[prop], obj[prop] );
                    } else {
                        extended[prop] = obj[prop];
                    }
                }
            }
        };

        // Loop through each object and conduct a merge
        for ( ; i < length; i++ ) {
            let obj = args[i];
            merge(obj);
        }

        return extended;
    },

    /**
     * html tag unescape
     * @param str
     * @returns {*|string}
     */
    unescapeHtml : (str) => {
        if (str == null) return "";
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
            .replace(/&#184;/g, ",");
    },

    /**
     * html tag escape
     * @param str
     * @returns {string|*|string}
     */
    escapeHtml : (str) => {
        if (str == null) return "";
        let entityMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&apos;'
        };
        return typeof str === 'string' ? str.replace(/[&<>"']/g,  (s) => {
            return entityMap[s];
        }) : str;
    },

    /**
     * 천단위 콤마 추가
     * @param str
     * @returns {*|string}
     */
    addComma : (str) => {
        if (tiUtil.checkNULL(str) === '') return '0';
        return str.toString().replace(/\\,/g, '').replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
    },

    /**
     * 그리드 천단위 콤마 추가
     * @param str
     * @returns {*|string}
     */
    gridAddComma : (str) =>  {
        if (tiUtil.checkNULL(str.value) === '') return '0';
        return str.value.toString().replace(/\\,/g, '').replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
    },

    /**
     * 빈 값 체크
     * @param o
     * @returns {boolean}
     */
    isEmptyVal : (o) => {
        if (typeof o == "undefined" || tiUtil.trim(o) === "") return true;
        else return typeof o == "object" && o === {};
    },

    /**
     * undefined 체크 공백 리턴
     * @param o
     * @returns {*|string}
     */
    checkNULL : (o) => {
        if (typeof o == "undefined" || tiUtil.trim(o) === "" || o == null || o === "undefined") return "";
        else return o;
    },

    /**
     * undefined 체크 공백 및 초기값 리턴
     * @param o
     * @param v
     * @returns {*}
     */
    nvl : (o, v) => {
        if ((typeof o == "undefined" || tiUtil.trim(o) === "" || o == null || o === "undefined") && typeof v != "undefined") return v;
        else if ((typeof o == "undefined" || tiUtil.trim(o) === "" || o == null || o === "undefined") && typeof v == "undefined") return "";
        else return o;
    },

    /**
     * text trim
     * @param text
     * @returns {string|string}
     */
    trim : (text) => {
        return text == null ? "" : (text + "").replace(tiUtil.rtrim, "$1");
    }

};
