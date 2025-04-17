(function($) {
    "use strict";

    $.extend({

        constant : {
            SUCCESS_CD: "0",
            FAIL_CD: "1",
            ERROR_CD: "500"
        },

        tinit : {

            init: function() {
                // alert initialize
                $.tinit.alertInit();
            },

            /**
             * form initialize
             */
            forminit: function() {
                // 화면의 상단 Scroll을 방지
                let _a = document.querySelectorAll('a');
                _a.forEach(function (a) {
                    if (a.getAttribute('href') === "#") a.setAttribute('href', 'javascript:');
                })
                $.tinit.objInit();
            },

            /**
             * form type setting
             */
            objInit : function() {
                let inputText = document.querySelectorAll('input[type=text]');
                inputText.forEach(function (a) {
                    a.addEventListener('focus', function () {
                        a.addEventListener('mouseup', function () {
                            a.select();
                            return false;
                        }, { once: true });
                    });
                });
            },

            /**
             * jquery confirm setting
             */
            alertInit : function() {
                jconfirm.defaults = {
                    useBootstrap: false,
                    typeAnimated: true,
                    type: 'darkblue',
                    theme: 'material',
                    animation: 'opacity',
                    closeAnimation: 'opacity',
                    bgOpacity: 0.5,
                    animateFromElement: false
                };
            },
        }

    });

})(jQuery);
