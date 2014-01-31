/*
 * 	Social Info 0.1 - jQuery plugin
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
		}
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
		getShareUrl : function(url, title ){
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
		getShareUrl : function( url ){
			url = url || location.href;
			return 'http://www.facebook.com/sharer.php?u=' + encodeURIComponent(url);
		},
		getSearchUrl : function( url ){
			url = url || location.href;
			return 'https://www.facebook.com/#!/search/results.php?q=' + encodeURIComponent( url );
		}
	}

	$.si.googleplus = {
		getShareUrl : function( url ){
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
				url : 'http://b.hatena.ne.jp/entry/json/',
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
		getProfileImgUrl : function(id, size){
			size = size ? '_'+size : '';
			return 'http://cdn.www.st-hatena.com/users/mo/'+id+'/profile'+size+'.gif';
		}
	};


})(jQuery);
