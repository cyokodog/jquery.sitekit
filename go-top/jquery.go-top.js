/*
 * 	Go Top 0.2 - jQuery plugin
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
(function(){
	var plugin = $.goTop = function(option){
		var c = plugin.config = $.extend(plugin.defaults,option||{});
		c.win = $(window);
		if(c.button = c.win.data('go-top')) return c.button;
		c.button = $('<a href="#"/>').addClass(c.className).hide().
		on('click',function(){
			$(this).blur();
			$('html,body').animate({scrollTop:0},c.scrollSpeed);
			return false;
		});
		c.win.data('go-top', c.button);
		!c.label || $('<span/>').text(c.label).appendTo(c.button);
		var lazy = plugin.Lazy(plugin.toggleButton,c.delay);
		$(window).on('scroll',function(){
			lazy.run();
		});

		if(c.autoAppend){
			c.button.appendTo('body');
			plugin.toggleButton();
		}
		var w = c.button.width(),m = parseInt(c.button.css('margin-left'));
		c.button.css('margin-left',-w+m);
		return c.button;
	}
	plugin.toggleButton = function(){
		var c = plugin.config;
		if(c.bottom == undefined){
			c.bottom = parseInt(c.button.css('bottom'));
			c.height = c.button.outerHeight();
		}
		if(c.win.scrollTop() >= c.showTopPosition){
			!c.button.is(':hidden') ||
			c.button.show().css('bottom',-c.height).animate({bottom:-1},function(){
				c.button.animate({bottom:-c.height+30});
			});
		}
		else{
			c.button.is(':hidden') || 
			c.button.animate({bottom:-c.height},function(){
				c.button.hide();
			});
		}
	}
	plugin.Lazy = function(f,time){
		return {
			run : function(){
				var o = this;
				if(o.delay){
					clearTimeout(o.delay);
					o.delay = 0;
				}
				o.delay = setTimeout(f,time);
			}
		}
	}
	plugin.defaults = {
		label : '',
		autoAppend : true,
		delay : 300,
		scrollSpeed : 300,
		fadeSpeed : 500,
		className : 'go-top',
		showTopPosition : 400
	}
})(jQuery);
