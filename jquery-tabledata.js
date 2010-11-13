/**
 * Table data plugin
 * 
 * Author: Nahuel Defossé
 * Email: nahuel (dot) defosse (at) gmail
 * Date: 2010-11-13
 * Version: 0.1
 */
(function ( $ ) {

    // Taken from 
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
            try {
                event.preventDefault();
            } catch (e){
                // Called without event
            }
            var $rolldown = $(this).data('__rolldown');
            
            var $link = $(this);
            
            if (! $rolldown){
                console.log("Tabledata::Create");
                $rolldown = methods.createElement.call(this, cfg);
                // We bind the events here so we can have cfg references
                var $cell = $rolldown.find('td');
                $rolldown.bind({
                    beforeShow: function (evt){
                        methods.beforeShow.call($cell, evt, $link, cfg);
                    },
                    afterShow: function (evt) {
                        methods.afterShow.call($cell, evt, $link, cfg);
                    },
                    beforeHide: function (evt) {
                        methods.beforeHide.call($cell, evt, $link, cfg);
                    },
                    afterHide: function (evt) {
                        methods.afterHide.call($cell, evt, $link, cfg);
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
            if (cfg.textHidden){
                $link.text(cfg.textHidden);
            }
            if ($.isFunction(cfg.content)){
                //console.log("Callback for", this, arguments);
                $(this).html(cfg.content.call(this, $link, cfg));
            } else {
                // console.log("Content", cfg.content);
                
                $(this).html(cfg.content);
            }
            // Finally invoke the callback
            if ($.isFunction(cfg.callbackShow)){
                cfg.callbackShow.apply(this, $link, cfg);
            }
            if (cfg.hashPersistant){
                methods.set($link.data('__id'), 1);
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
            if (cfg.hashPersistant){
                methods.set($link.data('__id'), 0);
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
        },
        // Hash handling taken form http://stackoverflow.com/questions/1236217/storing-data-in-uris-after-hash
        // copyright Imagist 
        dump : function() {
            var hash = document.location.hash;
            var dump = new Array();
            
            if(hash.length == 0) return dump;
 
                hash = hash.substring(1).split('&');
                for(var key in hash) {
                    var pair = hash[key].split('=');
     
                    if(pair.length != 2 || pair[0] in dump)
                        return undefined;
     
                    // escape for storage
                    dump[unescape(pair[0])] = unescape(pair[1]);
                }
 
                return dump;
        },
        
        /**
         * Takes an associative array and stores it in the URI as a hash after the # prefix, replacing any pre-
         * existing hash.
         */
        load : function(array)
        {
            var first = true;
            var hash = '';
            
            for(var key in array)
            {
                if(!first) hash += '&';
                hash += escape(key) + '=' + escape(array[key]);
            }
            
            document.location.hash = hash;
        },
        
        /**
         * Get the value of a key from the hash.  If the hash does not contain the key or the hash is invalid,
         * the function returns undefined.
         */
        get : function(key)
        {
            return this.dump()[key];
        },
        
        /**
         * Set the value of a key in the hash.  If the key does not exist, the key/value pair is added.
         */
        set : function(key,value)
        {
            var dump = this.dump();
            dump[key] = value;
            
            var hash = new Array();
            
            for(var key in dump)
                hash.push(escape(key) + '=' + escape(dump[key]));
            
            document.location.hash = hash.join('&');
        }
    }; // Methods

    var counter = 0;

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
            
            var _id = 'td_'+counter;
            var x = $this.data('__id', _id);
            
            if (cfg.hashPersistant) {
                // Handle hash 
                if (parseInt(methods.get(_id))){
                    methods.clickHandler.call($this, null, cfg);
                }
            }

            counter++;

        });
        return this; // Chaining
    }
})( jQuery );