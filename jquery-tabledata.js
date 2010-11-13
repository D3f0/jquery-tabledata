/**
 * Table data plugin
 */
(function ( $ ) {

    var methods = {
        clickHandler: function (event, cfg){
            event.preventDefault();
            var $rolldown = $(this).data('__rolldown');
            
            if (! $rolldown){
                console.log("Tabledata::Create");
                methods.createElement.call(this, cfg).fadeIn();
                
            } else {
                // Hidden
                if ($rolldown.css('display') == 'none') {
                    // To be showed
                    //console.info("To be shown");
                    
                } else {
                    // To be hidden
                    //console.info("To be hidden");
                    if (cfg.textHidden) {
                        $(this).innerHTML = cfg.textHidden;
                    }
                }
                // Toggle widget visibility
                $rolldown.toggle();
                //console.info("Toggle");
            }
            // Class toggle
            if (cfg.toggleClass) {
                $(this).toggleClass(cfg.toggleClass);
            }
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
            content: '&nbsp', // a string or function
            callbackShow: null, // TODO: Implement this!
            callbackHide: null,  // TODO: Implement this!
            toggleClass: null,
            textShown: null,
            textHidden: null,
            hashPersistant: false // Sotre state in url's hash
        };


        return this.each(function (){
            
            if ( cfg ) {
                $.extend( default_cfg, cfg);
            }
            
            var $this = $(this);
            
            if (!cfg.textShown) {
                // Save the text show in case it has not been defined
                cfg.textShown = $this.innerHTML;
            }
            
            $this.click(function (event){
                methods.clickHandler.call($this, event, cfg);
            });


        });
        return this; // Chainging
    }
})( jQuery );