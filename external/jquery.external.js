/*
 * 	External 0.1 - jQuery plugin
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
//External
(function(){
	$.fn.external = function(option){
		var c = $.extend($.fn.external.defaults,option||{});
		var reg = new RegExp('^' + location.host);
		this.each(function(index) {
			var target = $(this);
			if(!reg.test(target[0]['host']) && target.prop('href')){
				target.prop('target','_blank');
				var className = c.className;
				typeof className != 'function' || (className = className(target, index));
				if(className && (c.imageLink || !target.find('img').size() || $.trim(target.text()).length)){
					target.addClass(className);
				}
			}
		});
		return this;
	}
	$.fn.external.defaults = {
		className : 'external', // or function(element, index){return 'className'}
		imageLink : false
	}
})(jQuery);