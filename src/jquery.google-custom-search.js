
/*
 * 	Google Custom Search 0.1 - jQuery plugin
 *	written by cyokodog
 *
 *	Copyright (c) 2013 cyokodog 
 *		http://d.hatena.ne.jp/cyokodog/
 *		http://cyokodog.tumblr.com/
 *		http://www.cyokodog.net/
 *	MIT LICENCE
 *
 *	Built for jQuery library
 *	http://jquery.com
 *
 */
//Google Custom Search
(function($){
	var plugin = $.googleCustomSearch = function(target,option){
		var o = this,
		c = o.config = $.extend(true,{}, plugin.defaults, option);
		if(!c.cx) return;
		if(!c.displayButton) target.addClass('hide-gcse-button');
		$('<gcse:search></gcse:search>').appendTo(target);
		var gcse = document.createElement('script');
		gcse.type = 'text/javascript';
		gcse.async = true;
		gcse.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') +
		    '//www.google.com/cse/cse.js?cx=' + c.cx;
		var s = document.getElementsByTagName('script')[0];
		if(c.placeholder){
			(function(count){
				var self = arguments.callee;
				var inp = $('div.gsc-control-cse td.gsc-input div.gsc-input-box input.gsc-input');
				if(inp.size()){
					inp.attr('placeholder',c.placeholder);
					return;
				}
				count <= 0 || setTimeout(function(){self(count - 1);},1000);
			})(30);
		}
		s.parentNode.insertBefore(gcse, s);
	}
	plugin.defaults = {
		cx : '',
		displayButton : true,
		placeholder : 'Google Custom Search'
	}
	$.fn.googleCustomSearch = function(option){
		this.each(function(){
			var target = $(this);
			$.googleCustomSearch(target,option);
		});
	};
})(jQuery);
