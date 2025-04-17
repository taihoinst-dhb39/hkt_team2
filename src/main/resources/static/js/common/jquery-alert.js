(function ($) {
    "use strict";

    $.tialert = function (options) {
        if (typeof options.msg == "undefined") return;
        let cont = $.ti.replaceCarrigeBrAll(options.msg);
        let isError = options.hasOwnProperty('type')&&options.type==='error';
        top.$.confirm({
            boxWidth: options.hasOwnProperty('boxWidth')?options.boxWidth:'400px',
            useBootstrap: false,
            type: isError?'red':'dark',
            icon: isError?'fa fa-warning':'fas fa-exclamation-circle',
			title: isError?'Encountered an error!':'Info',
			content: cont,
            buttons: {
                ok: {
                    btnClass: isError?'btn-red':'btn-blue',
                    keys: ['enter', 'space', 'esc'],
                    action: function() {
                        if (typeof options.ok === "function") {
                            options.ok.call(this);
                        }
                    }
                }
            }
		});
    };

    $.ticonfirm = function (options) {
        if (typeof options.msg == "undefined") return;
        let cont = $.ti.replaceCarrigeBrAll(options.msg);
        top.$.confirm({
            boxWidth: options.hasOwnProperty('boxWidth')?options.boxWidth:'400px',
            useBootstrap: false,
            icon: 'far fa-question-circle',
			title: 'Confirm',
			content: cont,
            buttons: {
                ok: {
                    btnClass: 'btn-blue',
                    keys: ['enter', 'space'],
                    action: function() {
                        if (typeof options.ok === "function") {
                            options.ok.call(this);
                        }
                    }
                },
                cancel: {
                    btnClass: 'btn-warning',
                    action: function() {
                        if (typeof options.cancel === "function") {
                            options.cancel.call(this);
                        }
                    }
                }
            }
		});
    };

})(jQuery);