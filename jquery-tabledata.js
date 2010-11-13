/**
 * Table data plugin
 * 
 * Author: Nahuel Defossé
 * Email: nahuel (dot) defosse (at) gmail
 * Date: 2010-11-13
 * Version: 0.1
 */
(function ( $ ) {

    var _oldShow = $.fn.show;
    var _oldHide = $.fn.hide;

    $.fn.show = function(speed, oldCallback) {
        return $(this).each(function() {
            var obj = $(this);
            function newCallback () {
                if ($.isFunction(oldCallback)) {
                    oldCallback.apply(obj);
                }
                obj.trigger('afterShow');
                
            };
            // you can trigger a before show if you want
            obj.trigger('beforeShow');
            // now use the old function to show the element passing the new callback
            _oldShow.apply(obj, [speed, newCallback]);
        });
    }
    $.fn.hide = function(speed, oldCallback) {
        return $(this).each(function() {
            var obj = $(this);
            function newCallback() {
                if ($.isFunction(oldCallback)) {
                    oldCallback.apply(obj);
                }
                obj.trigger('afterHide');
            };
            // you can trigger a before show if you want
            obj.trigger('beforeHide');
            // now use the old function to show the element passing the new callback
            _oldHide.apply(obj, [speed, newCallback]);
        });
    }
    
    var methods = {
        clickHandler: function (event, cfg){
            event.preventDefault();
            var $rolldown = $(this).data('__rolldown');
            var $link = $(this);
            
            if (! $rolldown){
                console.log("Tabledata::Create");
                $rolldown = methods.createElement.call(this, cfg);
                // We bind the events here so we can have cfg references
                $rolldown.bind({
                    beforeShow: function (evt){
                        methods.beforeShow.call($rolldown, evt, $link, cfg);
                    },
                    afterShow: function (evt) {
                        methods.afterShow.call($rolldown, evt, $link, cfg);
                    },
                    beforeHide: function (evt) {
                        methods.beforeHide.call($rolldown, evt, $link, cfg);
                    },
                    afterHide: function (evt) {
                        methods.afterHide.call($rolldown, evt, $link, cfg);
                    }
                });


                $rolldown.fadeIn({
                    callback: function (evt) {
                        methods.beforeShow.call($rolldown, evt, $link, cfg);
                    }
                });
                
            } else {
                // Toggle widget visibility
                $rolldown.toggle();
                console.info("Toggle");
            }
            // Class toggle
            if (cfg.toggleClass) {
                $(this).toggleClass(cfg.toggleClass);
            }
        },
        /**
         * Called before.
         */
        beforeShow: function (evt, $link, cfg){
            console.info("Before show");
            var $cell = $(this).find('td');
            if (cfg.textHidden){
                $link.text(cfg.textHidden);
            }
            if ($.isFunction(cfg.content)){
                console.log("Callback for", this, arguments);
                $cell.text(cfg.content.call(this, $link, cfg));
            } else {
                $cell.text(cfg.content);
            }
            // Finally invoke the callback
            if ($.isFunction(cfg.callbackShow)){
                cfg.callbackShow.apply(this, $link, cfg);
            }
        },
        afterShow: function (evt, $link, cfg) {
            console.info("After show");
        },
        beforeHide: function (evt, $link, cfg) {
            console.info("Before hide");
            if (cfg.textShown){
                $link.text(cfg.textShown);
            }
        },
        afterHide: function (evt, $link, cfg) {
            console.info("After hide1");
        },
        /**
         * Creates the element
         */
        createElement: function () {
            var row = $(this).parents('tr').get(0);
            var columns = $(row).find('td').length;
            var x = $(row).after('<tr style="display: none;"><td colspan='+columns+'></td></tr>');
            var next_row = $(row).next();
            $(this).data('__rolldown', next_row);
            return next_row;
        }
    }; // Methods


    $.fn.cellData = function (cfg){
        var default_cfg = {
            url: null,
            refreshOnShow: false,
            loadingClass: '', // Class to append while loading
            
            content: '&nbsp', // a string or function
            
            callbackShow: null, // TODO: Implement this!
            callbackHide: null,  // TODO: Implement this!

            toggleClass: null,
            
            textShown: null,
            textHidden: null,
            hashPersistant: false // Sotre state in url's hash
        };


        return this.each(function (){
            
            cfg = $.extend({}, default_cfg, cfg);

            console.log("CFG:", cfg);
            var $this = $(this);
            
            if (!cfg.textShown) {
                // Save the text show in case it has not been defined
                cfg.textShown = $this.text();
            }
            
            $this.click(function (event){
                methods.clickHandler.call($this, event, cfg);
            });


        });
        return this; // Chaining
    }
})( jQuery );