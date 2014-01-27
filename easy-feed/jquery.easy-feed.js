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
