/*
 * 	Mailto 0.2 - jQuery plugin
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
	$.mailto = function(option){
		var s = arguments.callee, c = s.config = $.extend({}, s.defaults, option);
		var qs = '';
		$.each(c, function(i){
			var v = c[i];
			if(i != 'to' && v) qs = qs + (qs ? '&' : '?') + i + '=' + encodeURIComponent(v);
		});
		return 'mailto:' + c.to + qs;
	}
	$.mailto.call = function(option){
		var url = $.mailto(option);
		var s = arguments.callee, c = $.mailto.config;
		if(c.callFromIFrame){
			s.iframe = s.iframe || $('<iframe/>').hide().appendTo('body');
			s.iframe.prop('src', url);
		}
		else{
			location.href = url;
		}
	}
	$.fn.mailto = function(option){
		return this.each(function(){
			$(this).prop('href', $.mailto(option));
		});
	}
	$.mailto.defaults = {
		to : '',
		cc : '',
		bcc : '',
		subject : '',
		body : '',
		callFromIFrame : true
	}
})(jQuery);
