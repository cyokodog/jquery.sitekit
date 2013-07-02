
/*
 * 	Site Kit 0.1 - jQuery plugin
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

	// Namespace
	$.social = $.social || {};

	// Constructor
	var plugin = $.social.buttons = function(option){
		var o = this,
		c = o.config = $.extend(true,{}, $.social.buttons.defaults, option, o.getDataParam());
		if(c.appendTo && $(c.appendTo).size() > c.index) {
			c.wrapper = $(c.appendTo).eq(c.index);
		}
		else{
			c.wrapper = $('<div/>').insertAfter(c.target);
		}
		c.wrapper.addClass('social-buttons-container');
		if(c.size == 'large') {
			c.wrapper.addClass('social-buttons-large');
			c.twitter['data-count'] = 'vertical';
			c.hatebu['layout'] = 'vertical-balloon';
			c.facebook['data-layout'] = 'box_count';
			c.googleplus['data-size'] = 'tall';
		}
		c.url = c.url || c.target.prop('href');
		c.sort = [];
		var add_sort = function(name){
			if(c[name] && c[name].sort){
				c.sort[c[name].sort-1] = name;
			}
			return add_sort;
		}
		add_sort('twitter')('hatebu')('facebook')('googleplus');
		!c.facebook || plugin.facebook.rendar();
		o.rendarForm();
	}

	// API
	$.extend($.social.buttons.prototype, {
		getDataParam : function(){
			try{eval('return ' + this.config.target.attr('data-' + plugin.id));}catch(e){return {};}
		},
		getTarget : function(){
			return this.config.target;
		},
		rendarForm : function(){
			var o = this, c = o.config;
			$.each(c.sort,function(){
				var name = this.toString();
				var className = $.social.buttons.id+'-' + name;
				if(!c.wrapper.find('.'+className).css('padding-top',100).size()){
					$('<span class="social-buttons-wrapper">&nbsp;</span>').addClass(className).appendTo(c.wrapper);
				}
				if(name == 'facebook'){
					o.rendarLink(name);
				}
			});
		},
		rendarLink : function(name){
			var o = this, c = o.config;
			var p = c[name],b = plugin[name];
			if(p && b){
				var urlName = (name == 'hatebu' ? 'url' : (name == 'twitter' ? 'data-url' : 'data-href' ) );
				p[urlName] = p[urlName] || c.url;
				c.wrapper.find('.'+$.social.buttons.id+'-'+name).prepend(b(p));
			}
		}
	});

	plugin.rendar = function(name, option){
		var b = plugin[name];
		if($.extend({},plugin.defaults, option)[name] && b){
			b.rendar();
		}
	}

	plugin.rendarAll = function(targets, option){
		var size = targets.size();
		var rendar = function(index){
			if(index <= size-1){
				var target = targets.eq(index);
				var api = target.data(plugin.id);
				$.each(api.config.sort,function(){
					var name = this.toString();
					if(name != 'facebook'){
						api.rendarLink(name);
						plugin.rendar(name, option);
					}
					var clear = function(wrap){
						var w = wrap.width() + parseInt(wrap.css('margin-right'));
						wrap.css({
							'width' : w,
							'margin-right' : 0,
							'padding-top':0,
							'background':'url("")'
						});
					}
					var watch = function(limit,api,name){
						var className = '.'+$.social.buttons.id+'-'+name;
						var wrap = api.config.wrapper.find(className);
						var iframe = wrap.find('iframe');
						if(limit){
							setTimeout(function(){
								try{
									if(iframe.size()){
										iframe.load(function(){
											setTimeout(function(){
												clear(wrap);
											},100);
										});
										setTimeout(function(){
											clear(wrap);
										},3000);
									}
								}
								catch(e){
								}
								watch(limit-1,api,name);
							},300);
						}
						else{
							if(iframe.size()){
								clear(wrap);
							}
							else{
								setTimeout(function(){
									clear(wrap);
								},3000);
							}
						}
					}
					watch(30,api,name);
				});
				setTimeout(function(){
					rendar(index + 1);
				},option.buttonGroupDelay);
			}
		}
		rendar(0);
	}

	// Setting
	$.extend($.social.buttons,{
		defaults : {
			appendTo : '',
			url : '',
			size : '',	//large
			hatebu : {
				sort : 1
			},
			twitter : {
				sort : 2
			},
			facebook : {
				sort : 3
			},
			googleplus : {
				sort : 4
			},
			buttonGroupDelay : 3000
		},
		version : '0.1.0',
		id : 'social-buttons'
	});

	// jQuery Method
	$.fn.socialButtons = function(option){
		var targets = this,api = [];
		targets.each(function(index) {
			var target = targets.eq(index);
			var obj = target.data(plugin.id) ||
				new $.social.buttons($.extend({}, option, {'target': target,'targets': targets, 'index': index}));
			api.push(obj);
			target.data(plugin.id, obj);
		});
		plugin.rendarAll(targets, $.extend(true,{}, $.social.buttons.defaults, option));
		return targets;
	}

	$.socialButtons = function(option){
		if(!option.appendTo) return;
		$('<a/>').prop('href',location.href).appendTo(option.appendTo).socialButtons(option);
	}


})(jQuery);

;(function($){
	var sb = $.social.buttons;
	sb.twitter = function(option){
		var c = $.extend({},sb.twitter.defaults,option);
		var data = {};
		for(var i in c) !c[i] || !(/^data-.+/.test(i)) || (data[i] = c[i]);
		return $('<a class="twitter-share-button" href="https://twitter.com/share"/>').
			text(c.text).
			attr(data);
	}
	sb.twitter.rendar = function(){
		$('<script/>').prop({
			charset : 'utf-8',
			src : 'http://platform.twitter.com/widgets.js'
		}).appendTo('body');
	}
	sb.twitter.defaults = {
		'text' : '',
		'data-url' : '',
		'data-text' : '',
		'data-via' : '',
		'data-lang' : '',
		'data-size' : '',
		'data-related' : '',
		'data-count' : '', //vertical
		'data-hashtags' : ''
	}
})(jQuery);

;(function($){
	var sb = $.social.buttons;
	sb.hatebu = function(option){
		var c = $.extend({},sb.hatebu.defaults,option);
		if(!c.title && c.url == location.href) c.title = $('title').text();
		return $('<a class="hatena-bookmark-button"></a>').
			prop({
				'href':'http://b.hatena.ne.jp/entry/' + encodeURIComponent(c.url),
				title : c.title
			}).
			attr({
				'data-hatena-bookmark-layout':c.layout
			});
	}
	sb.hatebu.rendar = function(){
		$('<script/>').prop({
			charset : 'utf-8',
			src : 'http://b.st-hatena.com/js/bookmark_button.js'
		}).appendTo('body');
	}		 
	sb.hatebu.defaults = {
		url : location.href,
		title : 'このエントリーをはてなブックマークに追加',
		layout : 'simple-balloon'	//simple,simple-balloon,standard-balloon,vertical-balloon
	}
})(jQuery);

;(function($){
	var sb = $.social.buttons;
	sb.facebook = function(option){
		var c = $.extend({},sb.facebook.defaults,option);
		var data = {};
		for(var i in c) !c[i] || !(/^data-.+/.test(i)) || (data[i] = c[i]);
		return $('<div class="fb-like facebook-like-button"/>').attr(data);
	}
	sb.facebook.rendar = function(){
		(function(d, s, id) {
			var js, fjs = d.getElementsByTagName(s)[0];
			  if (d.getElementById(id)) return;
			js = d.createElement(s);
			js.id = id;
			js.src = '//connect.facebook.net/ja_JP/all.js#xfbml=1';
			fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));
	}
	sb.facebook.defaults = {
		'data-href' : location.href,
		'data-send' : 'false',
		'data-layout' : 'button_count',	//button_count,box_count
		'data-show-faces' : 'false'
	}
})(jQuery);

;(function($){
	var sb = $.social.buttons;
	sb.googleplus = function(option){
		var c = $.extend({},sb.googleplus.defaults,option);
		var data = {};
		for(var i in c) !c[i] || !(/^data-.+/.test(i)) || (data[i] = c[i]);
		return $('<div class="g-plusone"/>').attr(data);
	}
	sb.googleplus.rendar = function(){
		$('<script/>').prop({
			charset : 'utf-8',
			src : 'https://apis.google.com/js/plusone.js'
		}).appendTo('body');
	}
	sb.googleplus.defaults = {
		'data-href' : location.href,
		'data-size': 'Medium'	//Medium,tall
	}
})(jQuery);

//Hatebu Users
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

//Google Custom Search
(function($){
	var plugin = $.googleCustomSearch = function(target,option){
		var o = this,
		c = o.config = $.extend(true,{}, plugin.defaults, option);
		if(!c.cx) return;
		if(!c.displayButton) target.addClass('hide-gcse-button');
		$('<gcse:search></gcse:search>').appendTo(target);
		var gcse = document.createElement('script');
		gcse.type = 'text/javascript';
		gcse.async = true;
		gcse.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') +
		    '//www.google.com/cse/cse.js?cx=' + c.cx;
		var s = document.getElementsByTagName('script')[0];
		if(c.placeholder){
			(function(count){
				var self = arguments.callee;
				var inp = $('div.gsc-control-cse td.gsc-input div.gsc-input-box input.gsc-input');
				if(inp.size()){
					inp.attr('placeholder',c.placeholder);
					return;
				}
				count <= 0 || setTimeout(function(){self(count - 1);},1000);
			})(30);
		}
		s.parentNode.insertBefore(gcse, s);
	}
	plugin.defaults = {
		cx : '',
		displayButton : true,
		placeholder : 'Google Custom Search'
	}
	$.fn.googleCustomSearch = function(option){
		this.each(function(){
			var target = $(this);
			$.googleCustomSearch(target,option);
		});
	};
})(jQuery);

//goTop
(function(){
	var plugin = $.goTop = function(option){
		var c = plugin.config = $.extend(plugin.defaults,option||{});
		c.button = $('<a href="#"/>').addClass(c.className).hide().
		on('click',function(){
			$(this).blur();
			$('html,body').animate({scrollTop:0},c.scrollSpeed);
			return false;
		});
		!c.label || $('<span/>').text(c.label).appendTo(c.button);



		var lazy = plugin.Lazy(plugin.toggleButton,c.delay);
		c.win = $(window).on('scroll',function(){
			lazy.run();



		});

/*
c.win.resize(function(){
//	c.button.css('left',$(window).width() - $('body').offset().left - c.button.outerWidth())
	c.button.css('left',$('body').offset().left + $('body').width() - (c.button.outerWidth()/2))
})
*/

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
