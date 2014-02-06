/*
 * 	Easy Social Buttons 0.1 - jQuery plugin
 *	written by cyokodog
 *
 *	Copyright (c) 2014 cyokodog 
 *		http://www.cyokodog.net/
 *		http://d.hatena.ne.jp/cyokodog/)
 *		http://cyokodog.tumblr.com/
 *	MIT LICENCE
 *
 *	Built for jQuery library
 *	http://jquery.com
 *
 */


;(function($){

	var plugin = $.esb = $.easySocialButtons = function(option ){
		var callee = arguments.callee;
		if(!(this instanceof callee)) return new callee(option );
		var o = this, c = o.config = $.extend(true, {}, callee.defaults, option);
		c.buttons = $('<div class="easy-social-buttons-container"/>');
		$.each(c.orders, function(){
			var sname = this.toString();
			var api = c[sname] = $.esb[sname](option );
			api.getButton().appendTo(c.buttons);
		});
	}
	$.extend(plugin.prototype, {
		getButtons : function(){
			var o = this, c = o.config;
			return c.buttons;
		},
		getButtonAPI : function(name ){
			var o = this, c = o.config;
			return c[name];
		},
	});
	$.extend(plugin, {
		defaults : {
			autoAdd : true,
			addMethod : 'insertAfter',
			callback : function(api ){},
			orders : ['hatebu','twitter', 'facebook', 'googleplus'],
			labels : {
				'hatebu' : 'B!',
				'twitter' : 't',
				'facebook' : 'f',
				'googleplus' : 'G+'
			}
		}
	});

	$.fn.easySocialButtons = function(option ){
		var c = option = $.extend(true, {}, plugin.defaults, option);
		return this.each(function(){
			var t = $(this);
			c.url = t.prop('href') || t.data('href') || t.data('url') || c.url || location.href;
			var api = $.easySocialButtons(c);
			if(c.autoAdd){
				api.getButtons(c)[c.addMethod](t);
			}
			c.callback.apply(t[0], [api]);
		});
	}

	var DF = plugin.defaults;
	$.each(DF.orders, function(idx){
		var sname = this.toString();
		var f = $.esb[sname] = function(option ){
			var callee = arguments.callee;
			if(!(this instanceof callee)) return new callee(option );
			var o = this, c = o.config = $.extend(true, {}, callee.defaults, option);
			c.url = c.url || location.href;
			c.button = $(c.tempalte);
			c.wrapper = c.button.hasClass('esb') ? c.button : c.button.find('.esb');
			c.label = c.wrapper.find('.esb-label').html(c.label);
			c.counter = c.wrapper.find('.esb-counter').html(c.waitCounter);
			c.entryLink = c.wrapper.find('a.esb-entry');
			c.searchLink = c.wrapper.find('a.esb-search');
			if(c.useImageColor) c.wrapper.addClass('esb-' + sname);
			if($.si){
				var SI = $.si[sname];
				if(c.counter.size()){
					if(!SI.getEntryCount){
						c.counter.hide();
					}
					else{
						SI.getEntryCount(c.url, function(count ){
							c.counter.text(count);
						});
					}
					c.entryLink.prop('href', SI.getEntryUrl(c.url )).prop('title', c.entryTitle);
					c.searchLink.prop('href', SI.getSearchUrl(c.url )).prop('title', c.searchTitle);
				}
			}
		}
		$.extend(f.prototype, {
			getButton : function(){
				var o = this, c = o.config;
				return c.button;
			}
		});
		$.extend(f, {
			id : sname,
			defaults : {
				url : '',
				label : DF.labels[sname],
				entryTitle : '投稿する',
				searchTitle : '検索する',
				waitCounter : '<span>&nbsp;</span>',
				tempalte : '<span class="esb"><a class="esb-label esb-entry" target="_blank"></a><a class="esb-counter esb-search" target="_blank"></a></span>',
				useImageColor : true
			}
		});
	});
})(jQuery);




