/*
 * 	Fitbar 0.0 - jQuery plugin
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
		if(c.showShadow) c.shadow = $('<div/>').addClass(s.id + '-shadow').css(c.position, 0).hide().appendTo('body');
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
			sts.isTopOut = sts.scrollTop >= sts.targetTop - parseInt(el.css('margin-top'));
			sts.isTopOutAll = sts.scrollTop >= sts.targetBottom;
			sts.isBottomOut = sts.scrollBottom <= sts.targetBottom + parseInt(el.css('margin-bottom'));
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
			c.target.width(sts.targetWidth);
			!c.shadow || c.shadow.show().height(c.target.outerHeight());
		},
		unFixed : function(){
			var o = this, c = o.config;
			c.target.removeClass(s.id + '-fixed');
			c.target.width('auto');
			c.blank.hide();
			!c.shadow || c.shadow.hide();
		},
		adjustPosition : function(){
			var o = this, c = o.config;
			var margin = {
				'margin-top':c.target.css('margin-top'),
				'margin-bottom':c.target.css('margin-bottom')
			};
			c.blank.css(margin)
			!c.shadow || c.shadow.css(margin);
			var isFixed = c.target.hasClass(s.id + '-fixed');
			var sts = o.getViewStatus(isFixed ? c.blank : c.target);
			if(c.effect){
				var prop = (c.position == 'top'? 'isTopOutAll' : 'isBottomOutAll');
				if(sts[prop]){
					if(!isFixed){
						o.fixed(sts);
						o.slideIn(c.target);
						!c.showShadow || o.slideIn(c.shadow);
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
			position : 'bottom',
			showShadow : true,
			effect : true
		},
		id : 'fitbar'
	});
})(jQuery);
