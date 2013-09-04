
/*
 * 	Keep Position 0.1 - jQuery plugin
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
;(function($){
	$.fn.keepPosition = function(){
		var key = 'keep-position-'+location.hostname;
		var now_submit;
		var win = $(window);
		this.each(function(){
			$(this).on('submit',function(){
				now_submit = true;
				$.cookie(key, win.scrollTop());
			});
		});
		win.on('unload',function(){
			if(!now_submit){
				$.removeCookie(key);
			}
		});
		setTimeout(function(){
			win.scrollTop($.cookie(key));
		},0);
	}
})(jQuery);
