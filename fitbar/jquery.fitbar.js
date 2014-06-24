/*
 * 	Fitbar 0.1 - jQuery plugin
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
	var s = $.fitbar = function(target, option){
		var o = this, c = o.config = $.extend({}, s.defaults, option);
		c.target = $(target);
		c.blank = $('<div/>').addClass(s.id + '-blank').insertAfter(c.target).hide();
		if(c.shadow) c._shadow = $('<div/>').addClass(s.id + '-shadow').css(c.position, 0).hide().appendTo('body');
		c._win = $(window)
			.on('scroll', function(){o.adjustPosition();})
			.on('resize', function(){o.adjustPosition();});
		setTimeout(function(){o.adjustPosition();},0);
	}
	$.extend($.fitbar.prototype, {
		getViewStatus : function(el){
			var o = this, c = o.config;
			var offset = el.offset();
			var sts = {
				scrollTop : c._win.scrollTop(),
				windowHeight : c._win.height(),
				targetWidth : el.width(),
				targetTop : offset.top,
				targetBottom : offset.top + el.outerHeight(),
			}
			sts.scrollBottom = sts.scrollTop + sts.windowHeight;
			sts.isTopOut = sts.scrollTop >= sts.targetTop
			sts.isTopOutAll = sts.scrollTop >= sts.targetBottom;
			sts.isBottomOut = sts.scrollBottom <= sts.targetBottom;
			sts.isBottomOutAll = sts.scrollBottom <= sts.targetTop;
			return sts;
		},
		slideIn : function(el){
			var o = this, c = o.config;
			var prop = {};
			prop[c.position] = - el.outerHeight();
			el.css(prop);
			setTimeout(function(){
				prop[c.position] = 0;
				el.animate(prop,1000)
			},100);
		},
		fixed : function(sts){
			var o = this, c = o.config;
			c.blank.show().height(c.target.outerHeight());
			c.target.css(c.position, 0);
			c.target.addClass(s.id + '-fixed');
			c.target.removeClass(s.id + '-none-fixed');
			c.target.width(c.blank.width());
			!c._shadow || c._shadow.show().height(c.target.outerHeight());
		},
		unFixed : function(){
			var o = this, c = o.config;
			c.target.removeClass(s.id + '-fixed');
			c.target.addClass(s.id + '-none-fixed');
			c.target.width('auto');
			c.blank.hide();
			!c._shadow || c._shadow.hide();
		},
		adjustPosition : function(){
			var o = this, c = o.config;
			var isFixed = c.target.hasClass(s.id + '-fixed');
			if(!isFixed){
				var margin = {
					'margin-top':c.target.css('margin-top'),
					'margin-bottom':c.target.css('margin-bottom'),
					'margin-right':c.target.css('margin-right'),
					'margin-left':c.target.css('margin-left')
				};
				c.blank.css(margin)
				!c._shadow || c._shadow.css(margin);
			}
			else{
				c.target.width(c.blank.width());
			}
			var sts = o.getViewStatus(isFixed ? c.blank : c.target);
			if(c.effect){
				var prop = (c.position == 'top'? 'isTopOutAll' : 'isBottomOutAll');
				if(sts[prop]){
					if(!isFixed){
						o.fixed(sts);
						o.slideIn(c.target);
						!c.shadow || o.slideIn(c._shadow);
					}
				}
				else{
					if(isFixed){
						var prop = (c.position == 'top'? 'isTopOut' : 'isBottomOut');
						if(!sts[prop]){
							o.unFixed();
						}
					}
				}
			}
			else{
				var prop = (c.position == 'top'? 'isTopOut' : 'isBottomOut');
				if(sts[prop]){
					if(!isFixed){
						o.fixed(sts);
					}
				}
				else{
					if(isFixed){
						o.unFixed();
					}
				}
			}
		}
	});
	$.fn.fitbar = function(option){
		return this.each(function(){
			$(this).data(s.id, new $.fitbar(this, option));
		});
	}
	$.extend(s, {
		defaults : {
			position : 'top',
			shadow : true,
			effect : true
		},
		id : 'fitbar'
	});
})(jQuery);
