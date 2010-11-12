/**
 * Table data plugin
 */
(function ( $ ) {

    var methods = {
        clickHandler: function (event, cfg){
            event.preventDefault();
            if (! $(this).data('rolldown')){
                var row = $(this).parents('tr').get(0);
                var columns = $(row).find('td').length;
                var x = $(row).after('<tr style="display: none;"><td colspan='+columns+'>'+cfg.content+'</td></tr>');
                var next_row = $(row).next();
                $(next_row).fadeIn();
                $(this).data('rolldown', next_row);
            } else {
                $(this).data('rolldown').toggle();
            }
            // Class toggle
            if (cfg.toggleClass) {
                $(this).toggleClass(cfg.toggleClass);
            }
        }
    }; // Methods


    $.fn.cellData = function (cfg){
        var default_cfg = {
            url: null,
            refreshOnShow: false,
            content: '', // Content or URL, URL has precedense
            callbackShow: null, // TODO: Implement this!
            callbackHide: null,  // TODO: Implement this!
            toggleClass: null,
            textShown: null,
            textHidden: null
        };


        return this.each(function (){
            if ( cfg ) {
                $.extend( default_cfg, cfg );
            }
            var $this = $(this);

            //                     $this.click(methods.clickHandler);
            if (!cfg.textShown) {
                cfg.textShown = $this.innerHTML;
            }
            
            $this.click(function (event){
                //try {
                    var self = $this;
                    methods.clickHandler.call(self, event, cfg);
                    //} catch (e) {alert(e);}
            });


        });
        return this; // Chainging
    }
})( jQuery );