/* ===================================================
 * ZLUX
 * https://zoolanders.com
 * ===================================================
 * Copyright (C) JOOlanders SL
 * http://www.gnu.org/licenses/gpl-2.0.html
 * ========================================================== */
/*! UIkit 2.6.0 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */

(function(addon) {

    if (typeof define == "function" && define.amd) { // AMD
        define("uikit-sticky", ["uikit"], function(){
            return jQuery.fn.uksticky || addon(window, window.jQuery, window.jQuery.UIkit);
        });
    }

    if(window && window.jQuery && window.jQuery.UIkit) {
        addon(window, window.jQuery, window.jQuery.UIkit);
    }

})(function(global, $, UI){

  var defaults = {
        top          : 0,
        bottom       : 0,
        clsactive    : 'uk-active',
        clswrapper   : 'uk-sticky',
        getWidthFrom : ''
      },

      $window = $(window),
      $document = $(document),

      sticked = [],

      windowHeight = $window.height(),

      scroller = function() {

        var scrollTop       = $window.scrollTop(),
            documentHeight  = $document.height(),
            dwh             = documentHeight - windowHeight,
            extra           = (scrollTop > dwh) ? dwh - scrollTop : 0;

        for (var i = 0; i < sticked.length; i++) {

            if(!sticked[i].stickyElement.is(":visible")) {
                continue;
            }

            var s = sticked[i], elementTop = s.stickyWrapper.offset().top, etse = elementTop - s.top - extra;

            if (scrollTop <= etse) {

                if (s.currentTop !== null) {
                    s.stickyElement.css({"position":"", "top":"", "width":""}).parent().removeClass(s.clsactive);
                    s.currentTop = null;
                }

            } else {

                var newTop = documentHeight - s.stickyElement.outerHeight() - s.top - s.bottom - scrollTop - extra;

                newTop = newTop<0 ? newTop + s.top : s.top;

                if (s.currentTop != newTop) {
                    s.stickyElement.css({"position": "fixed", "top": newTop, "width": s.stickyElement.width()});

                    if (typeof s.getWidthFrom !== 'undefined') {
                        s.stickyElement.css('width', $(s.getWidthFrom).width());
                    }

                    s.stickyElement.parent().addClass(s.clsactive);
                    s.currentTop = newTop;
                }
            }
        }

      },

      resizer = function() {
        windowHeight = $window.height();
      },

      methods = {

        init: function(options) {

          var o = $.extend({}, defaults, options);

          return this.each(function() {

            var stickyElement = $(this);

            if(stickyElement.data("sticky")) return;

            var stickyId      = stickyElement.attr('id') || ("s"+Math.ceil(Math.random()*10000)),
                wrapper       = $('<div></div>').attr('id', 'sticky-'+stickyId).addClass(o.clswrapper);

            stickyElement.wrapAll(wrapper);

            if (stickyElement.css("float") == "right") {
              stickyElement.css({"float":"none"}).parent().css({"float":"right"});
            }

            stickyElement.data("sticky", true);

            var stickyWrapper = stickyElement.parent();
            stickyWrapper.css('height', stickyElement.outerHeight());
            sticked.push({
              top: o.top,
              bottom: o.bottom,
              stickyElement: stickyElement,
              currentTop: null,
              stickyWrapper: stickyWrapper,
              clsactive: o.clsactive,
              getWidthFrom: o.getWidthFrom
            });
          });
        },

        update: scroller
      };

    // should be more efficient than using $window.scroll(scroller) and $window.resize(resizer):
    window.addEventListener('scroll', scroller, false);
    window.addEventListener('resize', resizer, false);

    $.fn.uksticky = function(method) {
      if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if (typeof method === 'object' || !method ) {
        return methods.init.apply( this, arguments );
      } else {
        $.error('Method ' + method + ' does not exist on jQuery.sticky');
      }
    };

    $(document).on("uk-domready", function(e) {
      setTimeout(function(){

        scroller();

        $("[data-uk-sticky]").each(function(){

          var $ele    = $(this);

          if(!$ele.data("sticky")) $ele.uksticky(UI.Utils.options($ele.attr('data-uk-sticky')));
        });
      }, 0);
    });

    return $.fn.uksticky;
});