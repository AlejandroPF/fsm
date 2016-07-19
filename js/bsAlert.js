(function ($) {
    $.bsAlert = function (options, callback) {
        var defaults = {
            msg: "Error",
            bsType: "danger",
            width: "1024",
            fade: "ease",
            duration: 2500
        };
        var settings = {};
        if ("object" === typeof options) {
            settings = $.extend({}, defaults, options);
        } else if ("string" === typeof options) {
            settings = defaults;
            settings.msg = options;
        }
        var el = $('<div></div>');
        el.addClass("alert alert-" + settings.bsType);
        el.html(settings.msg);
        el.css({
            position: "absolute",
            zIndex: "1000",
            top: "1em",
            width: settings.width,
            left: $(window).innerWidth() / 2 - settings.width / 2
        });
        el.hide();
        
        el.fadeIn(settings.fade);
        setTimeout(function () {
            el.fadeOut(settings.fade);
            if("undefined" !== typeof callback && $.isFunction(callback)){
                callback();
            }
        }, settings.duration);
        return el;
    }
})(jQuery);