/*
 * 	Fade Page 0.1 - jQuery plugin
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

	var f = $.fadePage = $.extend({
		autoRun : true,
		fadeInSpeed : 1000
	}, $.fadePage);

	f.exec = function(){
		$('body').addClass('fade-layer-off');
		$('<div class="fade-layer"/>').prependTo('body').fadeOut(f.fadeInSpeed, function(){
			$(this).remove();
		});
		$(window).on("beforeunload",function(e){
			$('body').fadeOut();
		});
	}

	jQuery(function($){
		if(f.autoRun){
			$.fadePage.exec();
		}
		else{
			$('body').addClass('fade-layer-off');
		}
	});

})(jQuery);

