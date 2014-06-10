/*
 * 	Picasa Zoom 0.1 - jQuery plugin
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
	$.fn.picasaZoom = function(){
		var target = this;
		var link = target.wrap('<a href="javascript:void(0)" class="picasa-zoom"/>').parent();
		link.on('click', function(){
			var img = $(this).find('img').css('opacity', 0.5);
			var size = ['/s144/', '/s800/'];
			var src = img.prop('src');
			size = (src.search(size[0]) < 0) ? size.reverse() : size;
			var src = img.prop('src').replace(size[0], size[1]);
			var dummy = $('<img/>').on('load', function(){
				img.prop('src', src).css('opacity', 1).hide().fadeIn();
				dummy.remove();
			}).prop('src',src);
		});
		return target;
	}
})(jQuery);
