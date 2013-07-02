/**
 *	Preformatear valores numericos de un input, usando el plugin accounting para formatos de moneda
 *	Version: 1.0
 *	URL: https://github.com/upadrian/preformatMoney/
 *	Description: 
 *		Muestra valores monetarios pre formateados en un formulario, de forma que el usuario vea los separadores de miles, la moneda y los decimales según se necesite.
 *		Al clickear el campo, se muestra el campo original, con el numero original editable.
 *	Requires: jQuery 1.9.1, accounting.js v0.3.2
 *	
 *	Author: upadrian, http://github.com/upadrian
 *	Copyright: Copyright 2013 Adrián Suárez
 *	Plugin template by: https://github.com/geetarista/jquery-plugin-template
 */
;(function($, document, window, undefined) {
    "use strict";
    var pluginName = 'preformat';
    var defaults = {
    	//accounting.formatMoney(number,[symbol = "$"],[precision = 2],[thousand = ","],[decimal = "."],[format = "%s%v"])
        symbol		: "$",
		precision	: 2,
		thousand	: ",",
		decimal		: ".",
		format		: "%s%v"
    };
    function Plugin(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);
        this.$el      = $(element);
        this.init();
    }
    Plugin.prototype = {
        init : function() {     
        	//chequeos previos
        	if(this.preChecksFail())
        		return false;
            var html = '<input readonly="readonly" type="text" name="pre-'+this.$el.attr("name")+'" id="pre-'+this.$el.attr("id")+'" value="" />';
			this.$el
				.data("display",this.$el.css("display"))
				.after(html)
				.css("display","none");
			this.$target = $("#pre-"+this.$el.attr("id"));
			this.$target
				.css("display",this.$el.data("display"))
				.css("cursor","pointer")
				.attr("class",this.$el.attr("class"));
			this.getValue();	
			this.setPreValue(this);
			this.setEvents(this);
        },
        preChecksFail : function(){
        	if(!this.$el.attr("id")){
        		try{
        			console.log("Preformat plugin: missed id attribute on...");
        			console.debug(this.$el);
				} catch(e){}
        		return true;
       		}
       		if(!this.$el.attr("name")){
        		try{
        			console.log("Preformat plugin: missed name attribute on...");
        			console.debug(this.$el);
				} catch(e){}
        		return true;
       		}
        	if(this.$el.attr("type") != "text" && this.$el.attr("type") != "number"){
        		try{
        			console.log("Preformat plugin: type "+this.$el.attr("type")+" not supported on...");
        			console.debug(this.$el);
				} catch(e){}
        		return true;
       		}
       		
			   if(typeof(accounting)!="object"){
       			try{
        			console.log("We need accounting plugin, get it on http://josscrowcroft.github.com/accounting.js");
				} catch(e){}
        		return true;
       		}
       		
       			
        },
        getValue : function(){
			this.valorOriginal = this.$el.val();
			if(!this.isNumber(this.valorOriginal)){
				this.valorOriginal = 0;
				this.$el.val(0);
			}
    	},
    	setEvents : function(plugin){
	    	plugin.$target.focus(function(){
	   			$(this).css("display","none");
	   			plugin.$el.css("display",plugin.$el.data("display")).focus();
	   		});
	    	plugin.$el
				.blur(function(){
	    			$(this).css("display","none");
	    			plugin.$target.css("display",plugin.$el.data("display"));
	    		})
	    		.change(function(){
	    			if(isNaN($(this).val())){
	    				$(this).val("0");
	    				return false;
    				}
	    			plugin.getValue();	
	    			plugin.setPreValue();
	    		})
	    		.keypress(function(ev){
	    			//http://stackoverflow.com/questions/3764821/best-way-to-restrict-a-text-field-to-numbers-only
	    			var iKeyCode = ev.which || ev.keyCode,
						aSpecialKeysForFirefox = [8, 9, 13, 16, 17, 27, 35, 36, 37, 38, 39, 40, 46],
						sKey = String.fromCharCode(iKeyCode);
					if(!sKey.match(/[0-9]/) && $.inArray(iKeyCode, aSpecialKeysForFirefox) < 0)
							ev.preventDefault();
	    		})
	    },
    	isNumber : function(n){
    		return !isNaN(+n) && isFinite(n);
		},
		setPreValue : function(){
			this.valor = accounting.formatMoney(this.valorOriginal, this.options.symbol, this.options.precision,  this.options.thousand, this.options.decimal,this.options.format); // $4.999,99
			this.$target.val(this.valor);
		},
		destroy : function(){
			this.$el
				.css("display",this.$el.data("display"))
				.unbind("blur")
				.unbind("change")
				.unbind("keydown")
				.data('plugin_' + pluginName,false);;
			this.$target.remove();
			this.$target=null;
		}
    };

    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, 'plugin_' + pluginName))
                $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
            else{
            	var plugin = $.data(this, 'plugin_' + pluginName);
            	if (typeof plugin[options] === 'function') 
					return plugin[options]();
    		}
		        
        });
    };
})(jQuery, document, window);