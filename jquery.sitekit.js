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
/*
 * 	Picasa Zoom 0.2 - jQuery plugin
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
	var plugin = $.fn.picasaZoom = function( option ){
		return this.each(function(){
			var c = $.extend({}, plugin.defaults, option );
			var target = $(this);
			var link = target.wrap('<a href="javascript:void(0)" class="picasa-zoom"/>').parent();
			var disp = target.css('display');
			link.css({'display': (disp += (disp == 'inline' ? '-block' : ''))});
			!c.useIcon || (c.icon = $('<span class="picasa-zoom-icon">+</span>').appendTo(link));
			link.on('click', function(){
				var img = $(this).find('img').css('opacity', 0.5);
				var size = [c.thumKey, c.pictKey];
				var src = img.prop('src');
				size = (src.search(size[0]) < 0) ? size.reverse() : size;
				src = img.prop('src').replace(size[0], size[1]);
				var dummy = $('<img/>').on('load', function(){
					img.prop('src', src).css('opacity', 1).hide().fadeIn();
					dummy.remove();
				}).prop('src',src);
				!c.icon || c.icon.text(c.icon.text() == '+' ? '-' : '+');
			});
		});
	}
	plugin.defaults = {
		useIcon : true,
		thumKey : '/s144/',
		pictKey : '/s800/',
	}
})(jQuery);
/*
 * 	Mailto 0.2 - jQuery plugin
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
	$.mailto = function(option){
		var s = arguments.callee, c = s.config = $.extend({}, s.defaults, option);
		var qs = '';
		$.each(c, function(i){
			var v = c[i];
			if(i != 'to' && v) qs = qs + (qs ? '&' : '?') + i + '=' + encodeURIComponent(v);
		});
		return 'mailto:' + c.to + qs;
	}
	$.mailto.call = function(option){
		var url = $.mailto(option);
		var s = arguments.callee, c = $.mailto.config;
		if(c.callFromIFrame){
			s.iframe = s.iframe || $('<iframe/>').hide().appendTo('body');
			s.iframe.prop('src', url);
		}
		else{
			location.href = url;
		}
	}
	$.fn.mailto = function(option){
		return this.each(function(){
			$(this).prop('href', $.mailto(option));
		});
	}
	$.mailto.defaults = {
		to : '',
		cc : '',
		bcc : '',
		subject : '',
		body : '',
		callFromIFrame : true
	}
})(jQuery);
/*
 * 	Easy Social Buttons 0.2 - jQuery plugin
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

	var plugin = $.esb = $.easySocialButtons = function(option ){
		var callee = arguments.callee;
		if(!(this instanceof callee)) return new callee(option );
		var o = this, c = o.config = $.extend(true, {}, callee.defaults, option);
		c.orders = option.orders || c.orders;
		c.buttons = $('<div class="easy-social-buttons-container"/>');
		if(c.inverseColor) c.buttons.addClass('esb-inverse');
		$.each(c.orders, function(){
			var sname = this.toString();
			var api = c[sname] = $.esb[sname](option );
			api.getButton().appendTo(c.buttons);
		});
	}
	$.extend(plugin.prototype, {
		getButtons : function(){ // ボタンの取得
			var o = this, c = o.config;
			return c.buttons;
		},
		getButtonAPI : function(name ){ // API の取得
			var o = this, c = o.config;
			return c[name];
		}
	});
	$.extend(plugin, {
		defaults : {
			autoAdd : true, // true でボタンの自動挿入を行う
			addMethod : 'insertAfter', // ボタンの挿入メソッドを指定
			callback : function(api ){}, // プラグイン実行後のコールバック処理
			orders : ['hatebu','twitter', 'facebook', 'googleplus'], // ボタンの表示順
			labels : { // サービスの表示名
				'hatebu' : 'B!',
				'twitter' : 'ｔ',
				'facebook' : 'ｆ',
				'googleplus' : 'G+'
			}
		},
		version : '0.2',
		id : 'easy-social-buttons',
		name : 'Easy Social Buttons'
	});

	$.fn.easySocialButtons = function(option ){
		var c = $.extend(true, {}, plugin.defaults, option);
		if(option) c.orders = option.orders || c.orders;
		return this.each(function(){
			var t = $(this);
			c.url = t.prop('href') || t.data('href') || t.data('url') || c.url;
			if(!c.url){
				c.url = location.href;
				c.addMethod = 'appendTo';
			}
			var api = $.easySocialButtons(c);
			if(c.autoAdd){
				api.getButtons(c)[c.addMethod](t);
			}
			c.callback.apply(t[0], [api]);
		});
	}

	var DF = plugin.defaults;
	$.each(DF.orders, function(idx){
		var sname = this.toString();
		var f = $.esb[sname] = function(option ){
			var callee = arguments.callee;
			if(!(this instanceof callee)) return new callee(option );
			var o = this, c = o.config = $.extend(true, {}, callee.defaults, callee.overwrite[sname] || {}, option, option[sname]);
			c.url = c.url || location.href;
			c.button = $(c.tempalte);
			c.wrapper = c.button.hasClass('esb') ? c.button : c.button.find('.esb');
			c.label = c.wrapper.find('.esb-label').html(c.label);
			c.counter = c.wrapper.find('.esb-counter').html(c.waitCounter);
			c.entryLink = c.wrapper.find('a.esb-entry');
			c.searchLink = c.wrapper.find('a.esb-search');
			if(c.useBrandColor) c.wrapper.addClass('esb-' + sname);
			if($.si){
				var SI = $.si[sname];
				if(c.counter.size() && SI.getEntryCount){
					SI.getEntryCount(c.url, function(count ){
						c.counter.text(count);
					});
				}
				!SI.getEntryUrl || c.entryLink.prop('href', SI.getEntryUrl(c.url )).prop('title', c.entryTitle);
				!SI.getSearchUrl || c.searchLink.prop('href', SI.getSearchUrl(c.url )).prop('title', c.searchTitle);
			}
		}
		$.extend(f.prototype, {
			getButton : function(){
				var o = this, c = o.config;
				return c.button;
			}
		});
		$.extend(f, {
			id : sname,
			defaults : {
				url : '',
				label : DF.labels[sname],
				entryTitle : '投稿する', // esb-entry クラスを持つ要素に割り当てる title 属性値
				searchTitle : '検索する', // esb-search クラスを持つ要素に割り当てる title 属性値
				waitCounter : '<span>&nbsp;</span>', // Web API の取得結果待ち時に表示するマークアップ 
				tempalte : '<span class="esb"><a class="esb-label esb-search" target="_blank"></a><a class="esb-counter esb-entry" target="_blank"></a></span>', // ボタンのテンプレート
				useBrandColor : true, // ブランドカラーの使用
				inverseColor : false // ブランドカラー未使用時の配色の反転
			},
			overwrite : {
				hatebu : {
					entryTitle : 'ブックマークする'
				}
			}
		});
	});
})(jQuery);
/*
 * 	Social Info 0.2 - jQuery plugin
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

	$.social = $.social || {};
	$.si = $.social.info = {
		jsonp : function( p ){
			return $.ajax({
				url:p.url,
				dataType:'jsonp',
				data:p.data,
				success:function( r ){
					p.callback(r);
				}
			});
		},
		reArg : function(url , callback){
			if(typeof url == 'object') return url;
			if(typeof url == 'function'){
				callback = url;
				url = '';
			}
			url = url || location.href;
			return {
				url : url,
				callback : callback
			};
		},
		cache : {
			twitter : {
				entryCount : {}
			}
		},
		version : '0.2',
		id : 'social-info',
		name : 'Social Info'
	}


	$.si.twitter = {
		getEntryCount : function(url, callback){
			var arg = $.extend({
				url : location.href,
				useCache : true,
				callback : function( count ){}
			}, $.si.reArg(url, callback))
			var cache = $.si.cache.twitter.entryCount;
			var eurl = encodeURIComponent(url);
			if(arg.useCache && cache[eurl] != undefined){
				arg.callback(cache[eurl]);
				return;
			}
			$.si.jsonp({
				url : 'http://urls.api.twitter.com/1/urls/count.json',
				data : {
					url : arg.url
				},
				callback : function(r){
					var count = r = !r ? 0 : r.count;
					cache[eurl] = count;
					arg.callback(count);
				}
			});
		},
		getEntryUrl : function(url, title ){
			url = url || location.href;
			if(title) title = '&text=' + encodeURIComponent(title);
			else{
				if(url == location.href) title = '&text=' + encodeURIComponent(document.title);
			}
			return 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(url) + (title || '');
		},
		getSearchUrl : function( url ){
			url = url || location.href;
			return 'https://twitter.com/search?q=' + encodeURIComponent( url );
		}
	}

	$.si.facebook = {
		getEntryCount : function( url , callback){
			var arg = $.si.reArg(url, callback)
			$.si.jsonp({
				url : 'https://graph.facebook.com/',
				data : {
					id : arg.url
				},
				callback : function(r){
					arg.callback(r.shares || 0);
				}
			});
		},
		getEntryUrl : function( url ){
			url = url || location.href;
			return 'http://www.facebook.com/sharer.php?u=' + encodeURIComponent(url);
		},
		getSearchUrl : function( url ){
			url = url || location.href;
			return 'https://www.facebook.com/#!/search/results.php?q=' + encodeURIComponent( url );
		}
	}

	$.si.googleplus = {
		getEntryCount : function( url , callback){
			var arg = $.si.reArg(url, callback)
			$.ajax({
				type: "get",
				dataType: "xml",
				url: "http://query.yahooapis.com/v1/public/yql",
				data: {
					q: "SELECT content FROM data.headers WHERE url='https://plusone.google.com/_/+1/fastbutton?hl=ja&url=" + arg.url + "' and ua='#Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.154 Safari/537.36'",
					format: "xml",
					env: "http://datatables.org/alltables.env"
				},
				success: function (data) {
					var content = $(data).find("content").text();
					var match = content.match(/window\.__SSR[\s*]=[\s*]{c:[\s*](\d+)/i);
					var count = (match != null) ? match[1] : 0;
					arg.callback(count);
				}
			});
		},
		getEntryUrl : function( url ){
			url = url || location.href;
			return 'https://plus.google.com/share?url=' + encodeURIComponent(url);
		},
		getSearchUrl : function( url ){
			url = url || location.href;
			return 'https://plus.google.com/u/0/?tab=mX#s/' + encodeURIComponent( url );
		}
	}


	$.si.hatebu = {
		getEntryCount : function( url , callback){
			var arg = $.si.reArg(url, callback)
			$.si.jsonp({
				url : 'http://api.b.st-hatena.com/entry.count',
				data : {
					url : arg.url
				},
				callback : arg.callback
			});
		},
		getEntryUrl : function(url){
			url = url || location.href;
			return 'http://b.hatena.ne.jp/entry/' + url.replace(/^http:\/\//,'').replace(/^https:\/\//,'s/');
		},
		getSearchUrl : function( url ){
			url = url || location.href;
			return 'http://b.hatena.ne.jp/entrylist?url=' + encodeURIComponent( url );
		},
		getEntryList : function( url, sort, callback){
			if(typeof sort == 'function'){
				callback = sort;
				sort = 'count';
			}
			if(typeof url == 'function'){
				callback = url;
				sort = 'count';
				url = '';
			}
			url = url || location.href;
			$.si.jsonp({
				url : 'http://b.hatena.ne.jp/entrylist/json',
				data : {
					sort : sort,
					url : url
				},
				callback : callback
			});
		},
		getEntry : function( url , callback){
			var arg = $.si.reArg(url, callback)
			$.si.jsonp({
				url : 'http://b.hatena.ne.jp/entry/jsonlite/',
				data : {
					url : arg.url
				},
				callback : arg.callback
			});
		},
		getProfileImgUrl : function(id, size){
			size = size ? '_'+size : '';
			return 'http://cdn.www.st-hatena.com/users/mo/'+id+'/profile'+size+'.gif';
		},
		getEntryImgUrl : function(url){
			return 'http://b.hatena.ne.jp/entry/image/' + url;
		}
	};


})(jQuery);
/*
 * 	Easy Feed - jQuery plugin
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
	var plugin = $.easyFeed = function(option){
		if(!option.feed) return;
		if(!(this instanceof plugin)) return new plugin(option);
		var o = this, c = o.config = $.extend({}, plugin.defaults, option);
		o.repeat(function(){
			if(!$.easyFeed.status.googleApiLoaded) return true;
			o.load();
		});
	}
	$.extend(plugin.prototype, {

		// Google Feed API の取得結果を返す
		getResult : function(){
			return this.config.result;
		},

		// リスト生成時のカレントエントリを返す
		getEntry : function(){
			return this.config.entry;
		},
		repeat : function(f){
			var o = this;
			if(f.apply(o)) setTimeout(function(){o.repeat(f)}, 1000);
		},
		load : function(){
			var o = this, c = o.config;
			c.feedApi = new google.feeds.Feed(c.feed); 
			c.feedApi.setNumEntries(c.numEntries);
			c.feedApi.load(function(result){
				c.result = result;
				c.callback.apply(o, [o, result]);
			});
		},
		buildUL : function(){
			var o = this, c = o.config;
			var r = c.result;
			var ul = $('<ul/>');
			$.each(r.feed.entries, function(i){
				c.entry = r.feed.entries[i];
				o.buildLI(c.entry).appendTo(ul)
			});
			c.onBuildUL.apply(o, [o, ul]);
			return ul;
		},
		buildLI : function(entry){
			var o = this, c = o.config;
			var a = $('<a/>');
			if(c.linkTarget) a.prop('target', c.linkTarget);
			var li = a.prop('href', entry.link).text(entry.title).wrap('<li/>').parent();
			c.onBuildLI.apply(o, [o, li]);
			return li;
		}
	});
	$.easyFeed.status = {
		googleApiLoaded : false
	}
	$.easyFeed.defaults = {
		feed : '', // feed URI
		numEntries : 10, // 読み込み件数
		callback : function(api){}, // フィード取得後のコールバック処理
		linkTarget : '_blank', // 生成するリンクの target 属性値
		onBuildUL : function(api, ul){}, // UL 要素生成時のコールバック処理
		onBuildLI : function(api, li){} // LI 要素生成時のコールバック処理
	}
	$.fn.easyFeed = function(option){
		return this.each(function(){
			var target = $(this);
			$.easyFeed($.extend({target: target, callback : function(api){
				api.buildUL().appendTo(target);
			}}, option));
		});
	}
	google.load("feeds", "1");
	google.setOnLoadCallback(function(){
		$.easyFeed.status.googleApiLoaded = true;
	});
})(jQuery);
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
/*
 * 	Google Custom Search 0.1 - jQuery plugin
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
