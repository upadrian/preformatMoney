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
        this.$el.data(name, this);
        this._defaults = defaults;
        var meta      = this.$el.data(name + '-opts');
        this.options     = $.extend(this._defaults, options, meta);
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
	    			plugin.getValue();	
	    			plugin.setPreValue();
	    		})
	    		.keydown(function(event){
	    			if(event.keyCode<96 || event.keyCode>105){
	    				if(
							event.keyCode != 8 //backspace
							&& event.keyCode != 37 //cursor keys
							&& event.keyCode != 38 //cursor keys
							&& event.keyCode != 39 //cursor keys
							&& event.keyCode != 40 //cursor keys
							&& event.keyCode != 13 //enter
							&& event.keyCode != 9 //tab
						)
							return false;
	    			}
	    		})
	    },
    	isNumber : function(n){
    		return !isNaN(+n) && isFinite(n);
		},
		setPreValue : function(){
			this.valor = accounting.formatMoney(this.valorOriginal, this.options.symbol, this.options.precision,  this.options.thousand, this.options.decimal,this.options.format); // $4.999,99
			this.$target.val(this.valor);
		}
    };

    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, 'plugin_' + pluginName))
                $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
        });
    };
})(jQuery, document, window);