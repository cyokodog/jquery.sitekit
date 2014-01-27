/*
 * 	Social Buttons - jQuery plugin
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
