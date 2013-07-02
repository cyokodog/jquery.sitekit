# Web サイト作成時に必要になりがちな機能をまとめた jQuery Site Kit

なにか近頃なにもやる気が起きずブログも更新してませんでしたが、ぼちぼちはじめようかなと思います。だいぶ前に作った jQuery プラグインの紹介です。大したものじゃありませんが、よかったら使ってみてください。

## 概要

以下の事ができます。

- ソーシャルボタンの表示
- はてブユーザ数リンクの表示
- 外部ドメインリンクへの target="_blank" の設定
- ページトップへ戻るボタンの表示
- Google カスタム検索フォームの設置

## 使い方

GitHub からソース一式をダウンロードします。

- [jquery.sitekit - GitHub](https://github.com/cyokodog/jquery.sitekit)

必要なファイルを読み込みます。

##### HTML

	<link rel="stylesheet" type="text/css" media="screen" href="sitekit.css">
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
	<script src="jquery.sitekit.js"></script>

## ソーシャルボタンの表示

図

はてブ、Twitter、Facebook、Google+ のソーシャルボタンを表示できます。ソーシャルボタンの表示というとロードの遅延でガタガタと表示されてく見栄えが気になるところですが、このプラグインではデータがロードされるまではグレーアウトで表示され、ロード完了でカラー表示するようにしてます。

マイクロソフトさんも「[コンテンツの本質でない Facebook, Google+, Twitterのボタンなどのスクリプトは遅延ロードさせる](http://coliss.com/articles/build-websites/operation/work/cross-browser-best-practices-by-modern-ie.html)」とおっしゃってるようなので、遅延実行等の地味で面倒な実装に労力を割いてます。（詳しくはソースを見てください）

### 表示してるページのソーシャルボタンを表示する

appendTo パラメータでボタンの挿入場所を指定し、$.socialButtons() メソッドを実行します。

	$.socialButtons({appendTo : 'div.social'});

[Demo]()


### リンク一覧に対しソーシャルボタンを表示する

図

例えばこんなマークアップがあった場合

	<ul class="links">
		<li><a href="...">...</a><div class="social"></div></li>
		<li><a href="...">...</a><div class="social"></div></li>
		<li><a href="...">...</a><div class="social"></div></li>
	</ul>

リンク要素を jQuery でセレクタで取得し、socialButtons() メソッドを実行します。

	$('ul.links a').socialButtons({appendTo : 'div.social'});

[Demo]()

### 大きいソーシャルボタンを表示する

図

size パラメータに "large" を指定します。

	$.socialButtons({
		size : 'large',
		appendTo : 'div.social'
	});

### ソーシャルボタンの表示順を変える

sort パラメータに表示順を指定します。

	$.socialButtons({
		facebook : { sort : 1 },
		twitter : { sort : 2 },
		hatebu : { sort : 3 },
		googleplus : { sort : 4 },
		appendTo : 'div.social'
	});

### 一部のソーシャルボタンのみ表示する

表示したくないボタン名に false を指定します。

	$.socialButtons({
		googleplus : false,
		appendTo : 'div.social'
	});

### 任意の URL のソーシャルボタンを表示する

url パラメータに URL を指定します。

	$.socialButtons({
		url : 'http://www.cyokodog.net/',
		appendTo : 'div.social'
	});

## はてブユーザ数リンクの表示

図

はてブユーザ数を表示したいリンク要素を jQuery でセレクタで取得し、hatebuUsers() メソッドを実行します。

	$('ul.links a').hatebuUsers();

[Demo]()

負荷分散のために 1 秒間隔で はてブ API にリクエストするようになってます。間隔を変える場合は delay パラメータで指定します。

	$('ul.links a').hatebuUsers({
		delay : 500
	});

画像リンクには適用されません。適用する場合は imageLink パラメータに true を指定します。

	$('ul.links a').hatebuUsers({
		imageLink : true
	});

処理を割り込ませたり、一部のリンクに適用したくない場合は each パラメータで処理を記述します。

	$('ul.links a').hatebuUsers({
		each : function(element, index){
			//リンクにimg要素を含んでた場合は適用しない
			if(element.find('img').size()) {
				return false;
			}
			return true;
		}
	});


## 外部ドメインリンクへの target="_blank" の設定

図

外部ドメインリンクに target="_blank" とクラス名に "external" を設定します。

	$('ul.links a').external();

[Demo]()

画像リンクには適用されません。適用する場合は imageLink パラメータに true を指定します。

	$('ul.links a').external({
		imageLink : true
	});

## ページトップへ戻るボタンの表示

図

最近よく見かけるようになった、ページの最上部にスムーススクロールするボタンを表示する機能です。

$.goTop() メソッドを実行します。

	$.goTop();

[Demo]()

ページスクロールすると画面最下段に「にょきっ」とボタンが表示されます。


### ラベルを指定する

図

label パラメータを指定することで、ラベルを表示できます。

	$.goTop({label : 'TOP'});


### スクロールスピードを変更する

scrollSpeed パラメータで変更できます。

	$.goTop({scrollSpeed : 1000});

### 戻るボタンの表示位置を変える

CSS の margin-left と left で調整します。デフォルトでは右端から 32px の位置に表示されてます。

	a.go-top{
		margin-left:-32px;
		left:100%;
	}

中央に表示するには以下のようにします。

	a.go-top{
		margin-left:0;
		left:50%;
	}


## Google カスタム検索フォームの設置

図

Google カスタム検索フォームを挿入したい場所を jQuery でセレクタで取得し、googleCustomSearch() メソッドを実行します。

	$('div.search-area').googleCustomSearch({
		cx : '003362715722494588999:aaa8pejovqg'
	});

[Demo]()

cx パラメータには [Google カスタム検索ページ](http://www.google.com/cse/all)より取得した検索エンジンID を指定します。

### プレースホルダを指定する

図

placeholder パラメータで任意の文字列を指定します。

	$('div.search-area').googleCustomSearch({
		cx : '003362715722494588999:aaa8pejovqg',
		placeholder : 'Google カスタム検索！'
	});




