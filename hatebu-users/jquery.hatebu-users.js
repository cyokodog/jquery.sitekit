/*
 * 	Hatebu Users 0.1 - jQuery plugin
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
	$.hatebuUsers = function(url,callback){
		$.ajax({
			type: 'GET',
			url: 'http://api.b.st-hatena.com/entry.count',
			data: {
				url : url
			},
			dataType: 'jsonp',
			success: callback
		});
	}
	$.fn.hatebuUsers = function(option){
		var c = $.extend({},$.hatebuUsers.defaults,option);
		var targets = this, size = targets.size();
		var rendar = function(index){
			if(index <= size-1){
				var target = targets.eq(index);
				var apply = c.each(target, index);
				apply = (apply == undefined || !!apply ? true : false);
				!apply || c.imageLink || (apply = !target.find('img').size() || !!$.trim(target.text()).length);
				!apply || $.hatebuUsers(target.prop('href'),function(count){
					!count ||
						target.after('<a class="hatebu-users" target="_blank"/>').next().text(count+'users').prop({
							'href' : 'http://b.hatena.ne.jp/entry/' + target.prop('href').replace(/^https*:\/\//,'')
						});
				});
				setTimeout(function(){rendar(index + 1);},c.delay);
			}
		}
		setTimeout(function(){rendar(0);},c.firstDelay);
	};
	$.hatebuUsers.defaults = {
		firstDelay : 100,
		delay : 1000,
		imageLink : false,
		each : function(element, index){return true;}
	}
})(jQuery);
