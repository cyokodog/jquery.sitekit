/*
 * 	Mailto 0.1 - jQuery plugin
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
		var s = arguments.callee, c = $.extend({}, s.defaults, option);
		var qs = '';
		$.each(c, function(i){
			var v = c[i];
			if(i != 'to' && v) qs = qs + (qs ? '&' : '?') + i + '=' + encodeURIComponent(v);
		});
		return 'mailto:' + c.to + qs;
	}
	$.mailto.call = function(option){
		location.href = $.mailto(option);
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
		body : ''
	}

})(jQuery);
