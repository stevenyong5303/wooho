var $$ = Dom7;
var sys = new Object();
var STORAGE = window.localStorage;
var advertisementInterval, advertisementTimer = 0, gameInterval, gameTimer = 0;
var apps = new Framework7({
			  root: '#app',
			  id: 'com.wkv.game',
			  name: 'WOOHO',
			  theme: 'md',
			  version: "1.0.4",
			  rtl: false,
			  language: "en-US"
		  });
		  
var app = {
    initialize: function() {
        this.bindEvents();
    },
	
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
	
    onDeviceReady: function(){
        app.receivedEvent('deviceready');
		
		window.open = cordova.InAppBrowser.open;
		document.addEventListener("backbutton", sys.onBackKeyDown, false);
    },
	
    receivedEvent: function(id){
        console.log('Received Event: ' + id);
    }
};

$(document).ready(function(){
	var ajaxData = '', postAjaxData = '';
	
	// Live Page
	
	$('.btn-wlv').on('click', function(){
		var w = window.innerWidth,
			h = window.innerHeight;
		var sizeW = (w/500),
			sizeH = (h/(889+56));
			
		if(sizeW < sizeH){
			$('#live iframe').css('transform', 'scale(' + sizeW + ') rotate(90deg)');
			$('#live iframe').css('top', ((((sizeW*889)-889)/2)+250+'px'));
			$('#live iframe').css('left', (((((sizeW*500)-500)/2)-195)+'px'));
		}else{
			$('#live iframe').css('transform', 'scale(' + sizeH + ') rotate(90deg)');
			$('#live iframe').css('top', ((((sizeH*889)-889)/2)+250+'px'));
			$('#live iframe').css('left', (((((sizeH*500)-500)/2)-195)+'px'));
		}
		
		apps.loginScreen.open($('#live'), true);
	});
	
	$('#live .navbar .link.back').on('click', function(){
		apps.loginScreen.close($('#live'), true);
	});
	
	// Game Page
	
	$('#game .navbar .link.back').on('click', function(){
		var gameName = $('#game .iframe iframe').attr('id'),
			gameScore = 0;
			
		switch(gameName){
			case '2048':
				gameScore = parseInt($('span#score', $('#game .iframe iframe').contents()).text());
				break;
			case 'flappy':
				gameScore = parseInt($('#currentscore img', $('#game .iframe iframe').contents()).attr('alt'));
				break;
			case 'mario':
				gameScore = parseInt($('#data_display td.indisplay:eq(0)', $('#game .iframe iframe').contents()).text().substring(5));
				break;
			case 'pacman':
				gameScore = parseInt($('#score span', $('#game .iframe iframe').contents()).text());
				break;
			case 'bobble':
				gameScore = parseInt($('#score span', $('#game .iframe iframe').contents()).text());
				break;
			case 'sudoku':
				gameScore = parseInt($('#score span', $('#game .iframe iframe').contents()).text());
				break;
			case 'trexrunner':
				gameScore = parseInt($('body a#ctrl_up', $('#game .iframe iframe').contents()).attr('alt'));
				break;
			case 'tetris':
				gameScore = parseInt($('body #canvas', $('#game .iframe iframe').contents()).attr('alt'));
				break;
			case 'twodots':
				gameScore = parseInt($('div#score', $('#game .iframe iframe').contents()).text());
				break;
		}
		
		gameScore = (isNaN(gameScore) ? 0 : gameScore);
		
		var DATA = JSON.parse(STORAGE.getItem('data'));
			
		ajaxData = {
			'usr' : DATA.profile.username,
			'state' : DATA.profile.state,
			'game' : gameName,
			'score' : gameScore
		};
		postAjaxData = "ACT=" + encodeURIComponent('upload_check_score')
					 + "&DATA=" + encodeURIComponent(sys.serialize(ajaxData));
				  
		$.ajax({
			type: 'POST',
			url: 'http://wooho.fun/',
			data: postAjaxData,
			beforeSend: function(){
				apps.dialog.preloader();
			},
			success: function(str){
				var champion = JSON.parse(str), x = '';
				
				apps.dialog.close();
				
				x = '<div class="list"><ul>';
				for(var i=0; i<champion.day1.length; i++){
					x += '<li><div class="item-content">';
					x += '<div class="item-media"><img src="img/state/' + champion.day1[i].user_state + '.png" width="24" height="24"/></div>';
					x += '<div class="item-inner"><div class="item-title">' + champion.day1[i].user_id + '</div>';
					x += '<div class="item-after">' + champion.day1[i].score + '</div></div>';
					x += '</div></li>';
				}
				x += '</ul></div>';
				$('#scoreDay').html(x);
				
				x = '<div class="list"><ul>';
				for(var i=0; i<champion.day7.length; i++){
					x += '<li><div class="item-content">';
					x += '<div class="item-media"><img src="img/state/' + champion.day7[i].user_state + '.png" width="24" height="24"/></div>';
					x += '<div class="item-inner"><div class="item-title">' + champion.day7[i].user_id + '</div>';
					x += '<div class="item-after">' + champion.day7[i].score + '</div></div>';
					x += '</div></li>';
				}
				x += '</ul></div>';
				$('#scoreWeek').html(x);
				
				x = '<div class="list"><ul>';
				for(var i=0; i<champion.day30.length; i++){
					x += '<li><div class="item-content">';
					x += '<div class="item-media"><img src="img/state/' + champion.day30[i].user_state + '.png" width="24" height="24"/></div>';
					x += '<div class="item-inner"><div class="item-title">' + champion.day30[i].user_id + '</div>';
					x += '<div class="item-after">' + champion.day30[i].score + '</div></div>';
					x += '</div></li>';
				}
				x += '</ul></div>';
				$('#scoreMonth').html(x);
				
				apps.popover.open('.popover-leaderboard');
				
				window.clearInterval(gameInterval);
				$('#game .page .login-screen-content').css('background-color', '#fff');
				$('#game .iframe iframe').remove();
				
				apps.loginScreen.close($('#game'), true);
				apps.loginScreen.open($('#ptc'), true);
			}
		});
	});
	
	$('#game .navbar .link.replay').on('click', function(){
		apps.dialog.confirm(('Restart game?'), '', function(){
			var gameName = $('#game .iframe iframe').attr('id'),
				gameScore = 0;
				
			switch(gameName){
				case '2048':
					gameScore = parseInt($('span#score', $('#game .iframe iframe').contents()).text());
					break;
				case 'flappy':
					gameScore = parseInt($('#currentscore img', $('#game .iframe iframe').contents()).attr('alt'));
					break;
				case 'mario':
					gameScore = parseInt($('#data_display td.indisplay:eq(0)', $('#game .iframe iframe').contents()).text().substring(5));
					break;
				case 'pacman':
					gameScore = parseInt($('#score span', $('#game .iframe iframe').contents()).text());
					break;
				case 'bobble':
					gameScore = parseInt($('#score span', $('#game .iframe iframe').contents()).text());
					break;
				case 'sudoku':
					gameScore = parseInt($('#score span', $('#game .iframe iframe').contents()).text());
					break;
				case 'trexrunner':
					gameScore = parseInt($('body a#ctrl_up', $('#game .iframe iframe').contents()).attr('alt'));
					break;
				case 'tetris':
					gameScore = parseInt($('body #canvas', $('#game .iframe iframe').contents()).attr('alt'));
					break;
				case 'twodots':
					gameScore = parseInt($('div#score', $('#game .iframe iframe').contents()).text());
					break;
			}
			
			gameScore = (isNaN(gameScore) ? 0 : gameScore);
			
			var DATA = JSON.parse(STORAGE.getItem('data'));
			
			ajaxData = {
				'usr' : DATA.profile.username,
				'state' : DATA.profile.state,
				'game' : gameName,
				'score' : gameScore
			};
			postAjaxData = "ACT=" + encodeURIComponent('upload_score')
						 + "&DATA=" + encodeURIComponent(sys.serialize(ajaxData));
					  
			$.ajax({
				type: 'POST',
				url: 'http://wooho.fun/',
				data: postAjaxData,
				beforeSend: function(){
					apps.dialog.preloader();
				},
				success: function(str){
					apps.dialog.close();
					$('#game .iframe iframe')[0].contentDocument.location.href = $('#game .iframe iframe')[0].contentDocument.location.href;
				}
			});
		});
	});
	
	// Play and Win Page
	
	$('.btn-pnw').on('click', function(){
		apps.dialog.create({
			title : '',
			text : 'Enter Coupon Code',
			content: '<div class="dialog-input-field item-input"><div class="item-input-wrap"><input class="coupon-input" type="text" class="dialog-input"></div></div>',
			closeByBackdropClick: true,
			buttons: [
				{
					text: 'Get coupon number',
				},{
					text: 'OK',
				}
			],
			onClick: function(e, num){
				if(num == 1){
					var coupon = $('#app .dialog .coupon-input').val();
					
					ajaxData = {
						'usr' : DATA.profile.username,
						'state' : DATA.profile.state,
						'coupon' : coupon
					};
					postAjaxData = "ACT=" + encodeURIComponent('coupon_check')
								 + "&DATA=" + encodeURIComponent(sys.serialize(ajaxData));
							  
					$.ajax({
						type: 'POST',
						url: 'http://wooho.fun/',
						data: postAjaxData,
						beforeSend: function(){
							apps.dialog.preloader();
						},
						success: function(str){
							if(str === '200 OK'){
								$('#pnw').data('coupon', coupon);
								PNW();
							}else{
								apps.dialog.close();
								apps.dialog.alert('Invalid coupon code.', '');
							}
						}
					});
				}else if(num == 0){
					window.open('https://grab.onelink.me/2695613898?af_dp=grab%3A%2F%2Fopen%3FscreenType%3DTRANSFER%26method%3DQRCode%26pairingInfo%3DGPTransfer1b8f3b73b4fb4ca28c93c16d0fa4cb66');
				}
			}
		}).open();
	});
	
	$('#pnw .navbar .link.back').on('click', function(){
		apps.loginScreen.close($('#pnw'), true);
	});
	
	// Practice Page
	
	$('.btn-ptc').on('click', function(){
		apps.loginScreen.open($('#ptc'), true);
	});
	
	$('#ptc .navbar .link.back').on('click', function(){
		apps.loginScreen.close($('#ptc'), true);
	});
	
	$('.btn-ptc-tzf').on('click', function(){
		apps.dialog.confirm('deduct 1 coin / minute?', '', function () {
			if(c(STORAGE.getItem('data'))){
				var DATA = JSON.parse(STORAGE.getItem('data'));
				var curCoin = b(Object.keys(DATA.coin)[1]);
				
				if(curCoin<1){
					apps.dialog.close();
					apps.dialog.alert('Not enough coin. :(', '');
					apps.loginScreen.close($('#ptc'), true);
				}else{
					apps.dialog.preloader();
					curCoin--;
					var E = sys.genStr(6), T = sys.genStr(5), S = a(curCoin), G = md5(S), J = sys.genStr(6), Q = curCoin, F = true, K = false;
					
					DATA.coin = {};
					DATA.coin[T] = F;
					DATA.coin[S] = K;
					DATA.coin[J] = Q;
					DATA.coin[E] = G;
					STORAGE.setItem('data', JSON.stringify(DATA));
					
					$('#wooho-coin').find('.fab-text').text(Q);
			
					apps.loginScreen.close($('#ptc'), true);
					$('#game .navbar').find('.title').text('2048');
					$('#game .page .login-screen-content').css('background-color', '#F0F0D8');
					apps.loginScreen.open($('#game'), true);
					if(DATA.configuration.fullscreen){
						document.documentElement.requestFullscreen();
					}
					$('#game .iframe iframe').remove();
					$('#game .iframe').append('<iframe id="2048" src="games/2048/index.html" scrolling="no" width="550" height="650" allowfullscreen="true" onload="sys.onLoadHandler(\'tzfe\');"></iframe>');
				}
			}else{
				STORAGE.removeItem('data');
				location.reload();
			}
		});
	});
	
	$('.btn-ptc-fpb').on('click', function(){
		apps.dialog.confirm('deduct 1 coin / minute?', '', function () {
			if(c(STORAGE.getItem('data'))){
				var DATA = JSON.parse(STORAGE.getItem('data'));
				var curCoin = b(Object.keys(DATA.coin)[1]);
				
				if(curCoin<1){
					apps.dialog.close();
					apps.dialog.alert('Not enough coin. :(', '');
					apps.loginScreen.close($('#ptc'), true);
				}else{
					apps.dialog.preloader();
					curCoin--;
					var E = sys.genStr(6), T = sys.genStr(5), S = a(curCoin), G = md5(S), J = sys.genStr(6), Q = curCoin, F = true, K = false;
					
					DATA.coin = {};
					DATA.coin[T] = F;
					DATA.coin[S] = K;
					DATA.coin[J] = Q;
					DATA.coin[E] = G;
					STORAGE.setItem('data', JSON.stringify(DATA));
					
					$('#wooho-coin').find('.fab-text').text(Q);
			
					apps.loginScreen.close($('#ptc'), true);
					$('#game .navbar').find('.title').text('Flappy Bird');
					$('#game .page .login-screen-content').css('background-color', '#DED895');
					apps.loginScreen.open($('#game'), true);
					if(DATA.configuration.fullscreen){
						document.documentElement.requestFullscreen();
					}
					gameTimer = 0;
					$('#game .iframe iframe').remove();
					$('#game .iframe').append('<iframe id="flappy" src="games/flappybird/index.html" scrolling="no" width="500" height="550" allowfullscreen="true" onload="sys.onLoadHandler(\'flappy\');"></iframe>');
				}
			}else{
				STORAGE.removeItem('data');
				location.reload();
			}
		});
	});
	
	$('.btn-ptc-mro').on('click', function(){
		apps.dialog.confirm('deduct 1 coin / minute?', '', function () {
			if(c(STORAGE.getItem('data'))){
				var DATA = JSON.parse(STORAGE.getItem('data'));
				var curCoin = b(Object.keys(DATA.coin)[1]);
				
				if(curCoin<1){
					apps.dialog.close();
					apps.dialog.alert('Not enough coin. :(', '');
					apps.loginScreen.close($('#ptc'), true);
				}else{
					apps.dialog.preloader();
					curCoin--;
					var E = sys.genStr(6), T = sys.genStr(5), S = a(curCoin), G = md5(S), J = sys.genStr(6), Q = curCoin, F = true, K = false;
					
					DATA.coin = {};
					DATA.coin[T] = F;
					DATA.coin[S] = K;
					DATA.coin[J] = Q;
					DATA.coin[E] = G;
					STORAGE.setItem('data', JSON.stringify(DATA));
					
					$('#wooho-coin').find('.fab-text').text(Q);
			
					apps.loginScreen.close($('#ptc'), true);
					$('#game .navbar').find('.title').text('Mario');
					$('#game .page .login-screen-content').css('background-color', '#000000');
					apps.loginScreen.open($('#game'), true);
					if(DATA.configuration.fullscreen){
						document.documentElement.requestFullscreen();
					}
					gameTimer = 0;
					$('#game .iframe iframe').remove();
					$('#game .iframe').append('<iframe id="mario" src="games/mario/index.html" scrolling="no" width="500" height="580" allowfullscreen="true" onload="sys.onLoadHandler(\'mario\');"></iframe>');
				}
			}else{
				STORAGE.removeItem('data');
				location.reload();
			}
		});
	});
	
	$('.btn-ptc-pcm').on('click', function(){
		apps.dialog.confirm('deduct 1 coin / minute?', '', function () {
			if(c(STORAGE.getItem('data'))){
				var DATA = JSON.parse(STORAGE.getItem('data'));
				var curCoin = b(Object.keys(DATA.coin)[1]);
				
				if(curCoin<1){
					apps.dialog.close();
					apps.dialog.alert('Not enough coin. :(', '');
					apps.loginScreen.close($('#ptc'), true);
				}else{
					apps.dialog.preloader();
					curCoin--;
					var E = sys.genStr(6), T = sys.genStr(5), S = a(curCoin), G = md5(S), J = sys.genStr(6), Q = curCoin, F = true, K = false;
					
					DATA.coin = {};
					DATA.coin[T] = F;
					DATA.coin[S] = K;
					DATA.coin[J] = Q;
					DATA.coin[E] = G;
					STORAGE.setItem('data', JSON.stringify(DATA));
					
					$('#wooho-coin').find('.fab-text').text(Q);
			
					apps.loginScreen.close($('#ptc'), true);
					$('#game .navbar').find('.title').text('Pac Man');
					$('#game .page .login-screen-content').css('background-color', '#000');
					apps.loginScreen.open($('#game'), true);
					if(DATA.configuration.fullscreen){
						document.documentElement.requestFullscreen();
					}
					gameTimer = 0;
					$('#game .iframe iframe').remove();
					$('#game .iframe').append('<iframe id="pacman" src="games/pacman/index.html" scrolling="no" width="350" height="420" allowfullscreen="true" onload="sys.onLoadHandler(\'pacman\');"></iframe>');
				}
			}else{
				STORAGE.removeItem('data');
				location.reload();
			}
		});
	});
	
	$('.btn-ptc-pbb').on('click', function(){
		apps.dialog.confirm('deduct 1 coin / minute?', '', function () {
			if(c(STORAGE.getItem('data'))){
				var DATA = JSON.parse(STORAGE.getItem('data'));
				var curCoin = b(Object.keys(DATA.coin)[1]);
				
				if(curCoin<1){
					apps.dialog.close();
					apps.dialog.alert('Not enough coin. :(', '');
					apps.loginScreen.close($('#ptc'), true);
				}else{
					apps.dialog.preloader();
					curCoin--;
					var E = sys.genStr(6), T = sys.genStr(5), S = a(curCoin), G = md5(S), J = sys.genStr(6), Q = curCoin, F = true, K = false;
					
					DATA.coin = {};
					DATA.coin[T] = F;
					DATA.coin[S] = K;
					DATA.coin[J] = Q;
					DATA.coin[E] = G;
					STORAGE.setItem('data', JSON.stringify(DATA));
					
					$('#wooho-coin').find('.fab-text').text(Q);
			
					apps.loginScreen.close($('#ptc'), true);
					$('#game .navbar').find('.title').text('Puzzle Bobble');
					$('#game .page .login-screen-content').css('background-color', '#444444');
					apps.loginScreen.open($('#game'), true);
					if(DATA.configuration.fullscreen){
						document.documentElement.requestFullscreen();
					}
					gameTimer = 0;
					$('#game .iframe iframe').remove();
					$('#game .iframe').append('<iframe id="bobble" src="games/bobble/index.html" scrolling="no" width="500" height="800" allowfullscreen="true" onload="sys.onLoadHandler(\'bobble\');"></iframe>');
				}
			}else{
				STORAGE.removeItem('data');
				location.reload();
			}
		});
	});
	
	$('.btn-ptc-sdk').on('click', function(){
		apps.dialog.confirm('deduct 1 coin / minute?', '', function () {
			if(c(STORAGE.getItem('data'))){
				var DATA = JSON.parse(STORAGE.getItem('data'));
				var curCoin = b(Object.keys(DATA.coin)[1]);
				
				if(curCoin<1){
					apps.dialog.close();
					apps.dialog.alert('Not enough coin. :(', '');
					apps.loginScreen.close($('#ptc'), true);
				}else{
					apps.dialog.preloader();
					curCoin--;
					var E = sys.genStr(6), T = sys.genStr(5), S = a(curCoin), G = md5(S), J = sys.genStr(6), Q = curCoin, F = true, K = false;
					
					DATA.coin = {};
					DATA.coin[T] = F;
					DATA.coin[S] = K;
					DATA.coin[J] = Q;
					DATA.coin[E] = G;
					STORAGE.setItem('data', JSON.stringify(DATA));
					
					$('#wooho-coin').find('.fab-text').text(Q);
			
					apps.loginScreen.close($('#ptc'), true);
					$('#game .navbar').find('.title').text('Sudoku');
					$('#game .page .login-screen-content').css('background-color', '#fff');
					apps.loginScreen.open($('#game'), true);
					if(DATA.configuration.fullscreen){
						document.documentElement.requestFullscreen();
					}
					gameTimer = 0;
					$('#game .iframe iframe').remove();
					$('#game .iframe').append('<iframe id="sudoku" src="games/sudoku/index.html" scrolling="no" width="450" height="500" allowfullscreen="true" onload="sys.onLoadHandler(\'sudoku\');"></iframe>');
				}
			}else{
				STORAGE.removeItem('data');
				location.reload();
			}
		});
	});
	
	$('.btn-ptc-trr').on('click', function(){
		apps.dialog.confirm('deduct 1 coin / minute?', '', function () {
			if(c(STORAGE.getItem('data'))){
				var DATA = JSON.parse(STORAGE.getItem('data'));
				var curCoin = b(Object.keys(DATA.coin)[1]);
				
				if(curCoin<1){
					apps.dialog.close();
					apps.dialog.alert('Not enough coin. :(', '');
					apps.loginScreen.close($('#ptc'), true);
				}else{
					apps.dialog.preloader();
					curCoin--;
					var E = sys.genStr(6), T = sys.genStr(5), S = a(curCoin), G = md5(S), J = sys.genStr(6), Q = curCoin, F = true, K = false;
					
					DATA.coin = {};
					DATA.coin[T] = F;
					DATA.coin[S] = K;
					DATA.coin[J] = Q;
					DATA.coin[E] = G;
					STORAGE.setItem('data', JSON.stringify(DATA));
					
					$('#wooho-coin').find('.fab-text').text(Q);
			
					apps.loginScreen.close($('#ptc'), true);
					$('#game .navbar').find('.title').text('T-Rex Runner');
					$('#game .page .login-screen-content').css('background-color', '#fff');
					apps.loginScreen.open($('#game'), true);
					if(DATA.configuration.fullscreen){
						document.documentElement.requestFullscreen();
					}
					gameTimer = 0;
					$('#game .iframe iframe').remove();
					$('#game .iframe').append('<iframe id="trexrunner" src="games/trexrunner/index.html" scrolling="no" width="500" height="350" allowfullscreen="true" onload="sys.onLoadHandler(\'trex\');"></iframe>');
				}
			}else{
				STORAGE.removeItem('data');
				location.reload();
			}
		});
	});
	
	$('.btn-ptc-tts').on('click', function(){
		apps.dialog.confirm('deduct 1 coin / minute?', '', function () {
			if(c(STORAGE.getItem('data'))){
				var DATA = JSON.parse(STORAGE.getItem('data'));
				var curCoin = b(Object.keys(DATA.coin)[1]);
				
				if(curCoin<1){
					apps.dialog.close();
					apps.dialog.alert('Not enough coin. :(', '');
					apps.loginScreen.close($('#ptc'), true);
				}else{
					apps.dialog.preloader();
					curCoin--;
					var E = sys.genStr(6), T = sys.genStr(5), S = a(curCoin), G = md5(S), J = sys.genStr(6), Q = curCoin, F = true, K = false;
					
					DATA.coin = {};
					DATA.coin[T] = F;
					DATA.coin[S] = K;
					DATA.coin[J] = Q;
					DATA.coin[E] = G;
					STORAGE.setItem('data', JSON.stringify(DATA));
					
					$('#wooho-coin').find('.fab-text').text(Q);
					
					apps.loginScreen.close($('#ptc'), true);
					$('#game .navbar').find('.title').text('Tetris');
					$('#game .page .login-screen-content').css('background-color', '#3B2313');
					apps.loginScreen.open($('#game'), true);
					if(DATA.configuration.fullscreen){
						document.documentElement.requestFullscreen();
					}
					gameTimer = 0;
					$('#game .iframe iframe').remove();
					$('#game .iframe').append('<iframe id="tetris" src="games/tetris/index.html" scrolling="no" width="600" height="800" allowfullscreen="true" onload="sys.onLoadHandler(\'tetris\');"></iframe>');
				}
			}else{
				STORAGE.removeItem('data');
				location.reload();
			}
		});
	});
	
	$('.btn-ptc-tdt').on('click', function(){
		apps.dialog.confirm('deduct 1 coin / minute?', '', function () {
			if(c(STORAGE.getItem('data'))){
				var DATA = JSON.parse(STORAGE.getItem('data'));
				var curCoin = b(Object.keys(DATA.coin)[1]);
				
				if(curCoin<1){
					apps.dialog.close();
					apps.dialog.alert('Not enough coin. :(', '');
					apps.loginScreen.close($('#ptc'), true);
				}else{
					apps.dialog.preloader();
					curCoin--;
					var E = sys.genStr(6), T = sys.genStr(5), S = a(curCoin), G = md5(S), J = sys.genStr(6), Q = curCoin, F = true, K = false;
					
					DATA.coin = {};
					DATA.coin[T] = F;
					DATA.coin[S] = K;
					DATA.coin[J] = Q;
					DATA.coin[E] = G;
					STORAGE.setItem('data', JSON.stringify(DATA));
					
					$('#wooho-coin').find('.fab-text').text(Q);
					
					apps.loginScreen.close($('#ptc'), true);
					$('#game .navbar').find('.title').text('Two Dots');
					$('#game .page .login-screen-content').css('background-color', '#FFFFFF');
					apps.loginScreen.open($('#game'), true);
					if(DATA.configuration.fullscreen){
						document.documentElement.requestFullscreen();
					}
					gameTimer = 0;
					$('#game .iframe iframe').remove();
					$('#game .iframe').append('<iframe id="twodots" src="games/twodots/index.html" scrolling="no" width="500" height="500" allowfullscreen="true" onload="sys.onLoadHandler(\'twodots\');"></iframe>');
				}
			}else{
				STORAGE.removeItem('data');
				location.reload();
			}
		});
	});
	
	// Leaderboard Page
	
	$('.btn-ldb').on('click', function(){
		var DATA = JSON.parse(STORAGE.getItem('data'));
			
		ajaxData = {
			'usr' : DATA.profile.username,
			'state' : DATA.profile.state
		};
		postAjaxData = "ACT=" + encodeURIComponent('check_score')
					 + "&DATA=" + encodeURIComponent(sys.serialize(ajaxData));
				  
		$.ajax({
			type: 'POST',
			url: 'http://wooho.fun/',
			data: postAjaxData,
			beforeSend: function(){
				apps.dialog.preloader();
			},
			success: function(str){
				var champion = JSON.parse(str);
				
				$('#ldb').data('champion', champion);
				apps.dialog.close();
				apps.loginScreen.open($('#ldb'), true);
			}
		});
	});
	
	$('#ldb .navbar .link.back').on('click', function(){
		apps.loginScreen.close($('#ldb'), true);
	});
	
	$('#ldb').on('click', 'a.item-link', function(){
		var game = $(this).data('game'),
			champion = $('#ldb').data('champion'),
			x = '';
			
		x = '<div class="list"><ul>';
		for(var i=0; i<champion.day1[game].length; i++){
			x += '<li><div class="item-content">';
			x += '<div class="item-media"><img src="img/state/' + champion.day1[game][i].user_state + '.png" width="24" height="24"/></div>';
			x += '<div class="item-inner"><div class="item-title">' + champion.day1[game][i].user_id + '</div>';
			x += '<div class="item-after">' + champion.day1[game][i].score + '</div></div>';
			x += '</div></li>';
		}
		x += '</ul></div>';
		$('#scoreDay').html(x);
		
		x = '<div class="list"><ul>';
		for(var i=0; i<champion.day7[game].length; i++){
			x += '<li><div class="item-content">';
			x += '<div class="item-media"><img src="img/state/' + champion.day7[game][i].user_state + '.png" width="24" height="24"/></div>';
			x += '<div class="item-inner"><div class="item-title">' + champion.day7[game][i].user_id + '</div>';
			x += '<div class="item-after">' + champion.day7[game][i].score + '</div></div>';
			x += '</div></li>';
		}
		x += '</ul></div>';
		$('#scoreWeek').html(x);
		
		x = '<div class="list"><ul>';
		for(var i=0; i<champion.day30[game].length; i++){
			x += '<li><div class="item-content">';
			x += '<div class="item-media"><img src="img/state/' + champion.day30[game][i].user_state + '.png" width="24" height="24"/></div>';
			x += '<div class="item-inner"><div class="item-title">' + champion.day30[game][i].user_id + '</div>';
			x += '<div class="item-after">' + champion.day30[game][i].score + '</div></div>';
			x += '</div></li>';
		}
		x += '</ul></div>';
		$('#scoreMonth').html(x);
		
		apps.popover.open('.popover-leaderboard');
	});
	
	// Earn Credit
	
	$('button.btn-ecn').on('click', function(){
		// window.open("http://www.wkventertainment.com");
		
		// advertisementInterval = window.setInterval(function(){
			// advertisementTimer++;
		// }, 1000);
		
		if(c(STORAGE.getItem('data'))){
			var DATA = JSON.parse(STORAGE.getItem('data'));
			
			var curCoin = b(Object.keys(DATA.coin)[1]);
			curCoin+=10;
			var E = sys.genStr(6), T = sys.genStr(5), S = a(curCoin), G = md5(S), J = sys.genStr(6), Q = curCoin, F = true, K = false;
			
			DATA.coin = {};
			DATA.coin[T] = F;
			DATA.coin[S] = K;
			DATA.coin[J] = Q;
			DATA.coin[E] = G;
			STORAGE.setItem('data', JSON.stringify(DATA));
			
			$('#wooho-coin').find('.fab-text').text(Q);
			
			apps.dialog.alert('Yay, you earn 10 coin.', '');
		}else{
			STORAGE.removeItem('data');
			location.reload();
		}
	});
	
	// Setting Page
	
	$('.btn-stg').on('click', function(){
		apps.loginScreen.open($('#stg'), true);
	});
	
	$('#stg .navbar .link.back').on('click', function(){
		apps.loginScreen.close($('#stg'), true);
	});
	
	$('.btn-stc-usn').on('click', function(){
		var DATA = JSON.parse(STORAGE.getItem('data'));
		
		apps.dialog.prompt('What is your username?', '', function(name){
			DATA.profile.username = name;
			STORAGE.setItem('data', JSON.stringify(DATA));
			$('.btn-stc-usn').find('.item-after').text(name);
		});
	});
	
	$('.btn-stc-stt').on('click', function(){
		var DATA = JSON.parse(STORAGE.getItem('data'));
		var stateList = ['johor', 'kedah', 'kelantan', 'kualalumpur', 'labuan', 'melacca', 'negerisembilan', 'pahang', 'penang', 'perak', 'perlis', 'putrajaya', 'sabah', 'sarawak', 'selangor', 'terengganu'];
		var num = stateList.indexOf(DATA.profile.state);
		
		if(num != -1){
			if(num==15){
				num=0;
			}else{
				num++;
			}
			DATA.profile.state = stateList[num];
		}else{
			DATA.profile.state = 'kualalumpur';
		}
		$('img.state').attr('src', ('img/state/' + DATA.profile.state + '.png'));
		STORAGE.setItem('data', JSON.stringify(DATA));
	});
	
	$('.btn-stc-fsc').on('click', function(){
		var DATA = JSON.parse(STORAGE.getItem('data'));
		
		if(document.fullscreenEnabled){
			if(DATA.configuration.fullscreen){
				DATA.configuration.fullscreen = false;
				STORAGE.setItem('data', JSON.stringify(DATA));
				$('.btn-stc-fsc .item-after').data('state', 0);
				$('.btn-stc-fsc .item-after').text($('.btn-stc-fsc .item-after').data((DATA.configuration.language+'-off')));
			}else{
				DATA.configuration.fullscreen = true;
				STORAGE.setItem('data', JSON.stringify(DATA));
				$('.btn-stc-fsc .item-after').data('state', 1);
				$('.btn-stc-fsc .item-after').text($('.btn-stc-fsc .item-after').data((DATA.configuration.language+'-on')));
			}
		}else{
			var DATA = JSON.parse(STORAGE.getItem('data')), x = '';
			
			if(DATA.configuration.language=='en'){
				x = 'Your browser does not support fullscreen mode.';
			}else if(DATA.configuration.language == 'bm'){
				x = 'Pelayar internet anda tidak menyokong mod skrin penuh.';
			}else if(DATA.configuration.language == 'cn'){
				x = '您的互联网浏览器不支持全屏模式。';
			}else if(DATA.configuration.language == 'tm'){
				x = 'உங்கள் இணைய உலாவி முழுத்திரை பயன்முறையை ஆதரிக்காது.';
			}
			
			apps.toast.create({
				icon: '<i class="material-icons">aspect_ratio</i>',
				text: x,
				position: 'center',
				closeTimeout: 3000,
			}).open();
		}
	});
	
	$('.btn-stc-lgg').on('click', function(){
		var DATA = JSON.parse(STORAGE.getItem('data'));
			
		if(DATA.configuration.language=='en'){
			DATA.configuration.language = 'bm';
			STORAGE.setItem('data', JSON.stringify(DATA));
		}else if(DATA.configuration.language == 'bm'){
			DATA.configuration.language = 'cn';
			STORAGE.setItem('data', JSON.stringify(DATA));
		}else if(DATA.configuration.language == 'cn'){
			DATA.configuration.language = 'tm';
			STORAGE.setItem('data', JSON.stringify(DATA));
		}else{
			DATA.configuration.language = 'en';
			STORAGE.setItem('data', JSON.stringify(DATA));
		}
		
		$('.translate').each(function(){
			$(this).text($(this).data(DATA.configuration.language));
		});
		
		$('.translate_on_off').each(function(){
			if($(this).data('state')==1){
				$(this).text($(this).data((DATA.configuration.language+'-on')));
			}else{
				$(this).text($(this).data((DATA.configuration.language+'-off')));
			}
		});
	});
	
	$('.btn-stc-snd').on('click', function(){
		var DATA = JSON.parse(STORAGE.getItem('data'));
			
		if(DATA.configuration.sound){
			DATA.configuration.sound = false;
			STORAGE.setItem('data', JSON.stringify(DATA));
			$('.btn-stc-snd .item-after').data('state', 0);
			$('.btn-stc-snd .item-after').text($('.btn-stc-snd .item-after').data((DATA.configuration.language+'-off')));
		}else{
			DATA.configuration.sound = true;
			STORAGE.setItem('data', JSON.stringify(DATA));
			$('.btn-stc-snd .item-after').data('state', 1);
			$('.btn-stc-snd .item-after').text($('.btn-stc-snd .item-after').data((DATA.configuration.language+'-on')));
		}
	});
	
	$('.btn-stc-rst').on('click', function(){
		STORAGE.removeItem('data');
		location.reload();
	});
	
	// Start Function
	
	if(sys.isEmpty(STORAGE.getItem('data'))){
		var DATA = {
				'profile': {
					'username' : ('Guest' + sys.genNum(6)),
					'contact' : '',
					'state' : 'kualalumpur'
				},
				'configuration' : {
					'fullscreen' : true,
					'language' : 'en',
					'sound' : true
				},
				'coin' : {
					'gY8aH' : true,
					'Pd4' : false,
					'TadCax' : 0,
					'SgQwef' : 'e6d7362cde8aaaaba606825eeccdd506'
				}
			};
			
		$('.btn-stc-fsc .item-after').data('state', 1);
		$('.btn-stc-snd .item-after').data('state', 1);
		
		if(!document.fullscreenEnabled){
			DATA.configuration.fullscreen = false;
			$('.btn-stc-fsc .item-after').data('state', 0);
		}
		
		STORAGE.setItem('data', JSON.stringify(DATA));
		
		$('.btn-stc-usn').find('.item-after').text(DATA.profile.username);
		$('#wooho-coin').find('.fab-text').text(b(Object.keys(JSON.parse(STORAGE.getItem('data')).coin)[1]));
	}else{
		var DATA = JSON.parse(STORAGE.getItem('data'));
		
		$('#wooho-coin').find('.fab-text').text(b(Object.keys(JSON.parse(STORAGE.getItem('data')).coin)[1]));
		
		$('.btn-stc-usn').find('.item-after').text(DATA.profile.username);
		$('.btn-stc-stt').find('.item-after').html(('<img class="state" src="img/state/'+DATA.profile.state+'.png" width="36" height="36"/>'));
		
		if(DATA.configuration.fullscreen){
			$('.btn-stc-fsc .item-after').data('state', 1);
		}else{
			$('.btn-stc-fsc .item-after').data('state', 0);
		}
		
		if(DATA.configuration.sound){
			$('.btn-stc-snd .item-after').data('state', 1);
		}else{
			$('.btn-stc-snd .item-after').data('state', 0);
		}
		
		$('.translate').each(function(){
			$(this).text($(this).data(DATA.configuration.language));
		});
		
		$('.translate_on_off').each(function(){
			if($(this).data('state')==1){
				$(this).text($(this).data((DATA.configuration.language+'-on')));
			}else{
				$(this).text($(this).data((DATA.configuration.language+'-off')));
			}
		});
	}
	
	window.addEventListener('focus', function(){
		if(advertisementTimer!=0){
			window.clearInterval(advertisementInterval);
			
			if(advertisementTimer>10){
				if(c(STORAGE.getItem('data'))){
					var DATA = JSON.parse(STORAGE.getItem('data'));
					
					var curCoin = b(Object.keys(DATA.coin)[1]);
					curCoin+=10;
					var E = sys.genStr(6), T = sys.genStr(5), S = a(curCoin), G = md5(S), J = sys.genStr(6), Q = curCoin, F = true, K = false;
					
					DATA.coin = {};
					DATA.coin[T] = F;
					DATA.coin[S] = K;
					DATA.coin[J] = Q;
					DATA.coin[E] = G;
					STORAGE.setItem('data', JSON.stringify(DATA));
					
					$('#wooho-coin').find('.fab-text').text(Q);
					
					apps.dialog.alert('Yay, you earn 10 coin.', '');
				}else{
					STORAGE.removeItem('data');
					location.reload();
				}
			}else{
				apps.dialog.alert('Watch ads for more than 10 seconds to earn coin.', '');
			}
			advertisementTimer = 0;
		}
	});
});

sys = {
	'isEmpty' : function(mixed_value){
		if(mixed_value == null){
			return true;
		}else if(mixed_value == ''){
			return true;
		}else if(mixed_value == []){
			return true;
		}else if(mixed_value == {}){
			return true;
		}
		return false;
	},
	'serialize' : function(mixed_value){
		var val, key, okey, ktype = '', vals = '', count = 0,
			_utf8Size = function(str){
				var size = 0, i = 0, l = str.length, code = '';
				
				for(i = 0; i < l; i++){
					code = str.charCodeAt(i);
					if(code < 0x0080){
						size += 1;
					}else if(code < 0x0800) {
						size += 2;
					}else{
						size += 3;
					}
				}
				return size;
			},
			_getType = function(inp){
				var match, key, cons, types, type = typeof inp;

				if(type === 'object' && !inp){
					return 'null';
				}

				if(type === 'object'){
					if(!inp.constructor){
						return 'object';
					}
					
					cons = inp.constructor.toString();
					match = cons.match(/(\w+)\(/);
					
					if(match){
						cons = match[1].toLowerCase();
					}
					types = ['boolean', 'number', 'string', 'array'];
					for(key in types){
						if(cons === types[key]){
							type = types[key];
							break;
						}
					}
				}
				return type;
			},
			type = _getType(mixed_value);

		switch(type){
			case 'function':
				val = '';
				break;
			case 'boolean':
				val = 'b:' + (mixed_value ? '1' : '0');
				break;
			case 'number':
				val = (Math.round(mixed_value) === mixed_value ? 'i' : 'd') + ':' + mixed_value;
				break;
			case 'string':
				val = 's:' + _utf8Size(mixed_value) + ':"' + mixed_value + '"';
				break;
			case 'array':
			case 'object':
				val = 'a';
				for(key in mixed_value){
					if(mixed_value.hasOwnProperty(key)){
						ktype = _getType(mixed_value[key]);
						if (ktype === 'function'){
							continue;
						}
						okey = (key.match(/^[0-9]+$/) ? parseInt(key, 10) : key);
						vals += this.serialize(okey) + this.serialize(mixed_value[key]);
						count++;
					}
				}
				val += ':' + count + ':{' + vals + '}';
				break;
			case 'undefined':
			default:
				val = 'N';
				break;
		}
		
		if(type !== 'object' && type !== 'array'){
			val += ';';
		}
		return val;
	},
	'onBackKeyDown' : function(){
		if((!$('#home-btn').hasClass('tab-link-active')) || $('html').hasClass('with-modal-popup')){
			$('.popup-backdrop')[0].click();
			$('#home-btn')[0].click();
			
			if($('.evt_ord_tab').length){
				$('.evt_ord_tab').css('display', 'none');
			}
			
			return false;
		}else{
			function onConfirm(buttonIndex) {
				if(buttonIndex == 1){
					window.close();
				}
			}

			navigator.notification.confirm(
				'Exit the app?',
				onConfirm,
				'Confirmation',
				['OK','Cancel']
			);
		}
	},
	'onLoadHandler' : function(game){
		switch(game){
			case 'tzfe':
				var w = window.innerWidth,
					h = window.innerHeight;
				var sizeW = (w/550),
					sizeH = (h/(650+56));
					
				if(sizeW < sizeH){
					$('#game iframe').css('transform', 'scale(' + sizeW + ')');
					$('#game iframe').css('top', ((((sizeW*650)-650)/2)+56+'px'));
					$('#game iframe').css('left', ((((sizeW*550)-550)/2)+'px'));
				}else{
					$('#game iframe').css('transform', 'scale(' + sizeH + ')');
					$('#game iframe').css('top', ((((sizeH*650)-650)/2)+56+'px'));
					$('#game iframe').css('left', ((((sizeH*550)-550)/2)+'px'));
				}
				break;
				
			case 'flappy':
				var w = window.innerWidth,
					h = window.innerHeight;
				var sizeW = (w/500),
					sizeH = (h/(550+56));
					
				if(sizeW < sizeH){
					$('#game iframe').css('transform', 'scale(' + sizeW + ')');
					$('#game iframe').css('top', ((((sizeW*550)-550)/2)+56+'px'));
					$('#game iframe').css('left', ((((sizeW*500)-500)/2)+'px'));
				}else{
					$('#game iframe').css('transform', 'scale(' + sizeH + ')');
					$('#game iframe').css('top', ((((sizeH*550)-550)/2)+56+'px'));
					$('#game iframe').css('left', ((((sizeH*500)-500)/2)+'px'));
				}
				break;
				
			case 'mario':
				var w = window.innerWidth,
					h = window.innerHeight;
				var sizeW = (w/500),
					sizeH = (h/(580+56));
					
				if(sizeW < sizeH){
					$('#game iframe').css('transform', 'scale(' + sizeW + ')');
					$('#game iframe').css('top', ((((sizeW*580)-580)/2)+56+'px'));
					$('#game iframe').css('left', ((((sizeW*500)-500)/2)+'px'));
				}else{
					$('#game iframe').css('transform', 'scale(' + sizeH + ')');
					$('#game iframe').css('top', ((((sizeH*580)-580)/2)+56+'px'));
					$('#game iframe').css('left', ((((sizeH*500)-500)/2)+'px'));
				}
				break;
				
			case 'pacman':
				var w = window.innerWidth,
					h = window.innerHeight;
				var sizeW = (w/350),
					sizeH = (h/(420+56));
					
				if(sizeW < sizeH){
					$('#game iframe').css('transform', 'scale(' + sizeW + ')');
					$('#game iframe').css('top', ((((sizeW*420)-420)/2)+56+'px'));
					$('#game iframe').css('left', ((((sizeW*350)-350)/2)+'px'));
				}else{
					$('#game iframe').css('transform', 'scale(' + sizeH + ')');
					$('#game iframe').css('top', ((((sizeH*420)-420)/2)+56+'px'));
					$('#game iframe').css('left', ((((sizeH*350)-350)/2)+'px'));
				}
				break;
				
			case 'bobble':
				var w = window.innerWidth,
					h = window.innerHeight;
				var sizeW = (w/500),
					sizeH = (h/(800+56));
					
				console.log('w = ' + w + ', h = ' + h + ', sizeW' + sizeW + ', sizeH' + sizeH);
				if(sizeW < sizeH){
					$('#game iframe').css('transform', 'scale(' + sizeW + ')');
					$('#game iframe').css('top', ((((sizeW*800)-800)/2)+56+'px'));
					$('#game iframe').css('left', ((((sizeW*500)-500)/2)+'px'));
				}else{
					$('#game iframe').css('transform', 'scale(' + sizeH + ')');
					$('#game iframe').css('top', ((((sizeH*800)-800)/2)+56+'px'));
					$('#game iframe').css('left', ((((sizeH*500)-500)/2)+'px'));
				}
				break;
				
			case 'sudoku':
				var w = window.innerWidth,
					h = window.innerHeight;
				var sizeW = (w/450),
					sizeH = (h/(500+56));
					
				if(sizeW < sizeH){
					$('#game iframe').css('transform', 'scale(' + sizeW + ')');
					$('#game iframe').css('top', ((((sizeW*500)-500)/2)+56+'px'));
					$('#game iframe').css('left', ((((sizeW*450)-450)/2)+'px'));
				}else{
					$('#game iframe').css('transform', 'scale(' + sizeH + ')');
					$('#game iframe').css('top', ((((sizeH*500)-500)/2)+56+'px'));
					$('#game iframe').css('left', ((((sizeH*450)-450)/2)+'px'));
				}
				break;
				
			case 'trex':
				var w = window.innerWidth,
					h = window.innerHeight;
				var sizeW = (w/500),
					sizeH = (h/(350+56));
					
				if(sizeW < sizeH){
					$('#game iframe').css('transform', 'scale(' + sizeW + ')');
					$('#game iframe').css('top', ((((sizeW*350)-350)/2)+56+'px'));
					$('#game iframe').css('left', ((((sizeW*500)-500)/2)+'px'));
				}else{
					$('#game iframe').css('transform', 'scale(' + sizeH + ')');
					$('#game iframe').css('top', ((((sizeH*350)-350)/2)+56+'px'));
					$('#game iframe').css('left', ((((sizeH*500)-500)/2)+'px'));
				}
				break;
				
			case 'tetris':
				var w = window.innerWidth,
					h = window.innerHeight;
				var sizeW = (w/600),
					sizeH = (h/(800+56));
					
				if(sizeW < sizeH){
					$('#game iframe').css('transform', 'scale(' + sizeW + ')');
					$('#game iframe').css('top', ((((sizeW*800)-800)/2)+56+'px'));
					$('#game iframe').css('left', ((((sizeW*600)-600)/2)+'px'));
				}else{
					$('#game iframe').css('transform', 'scale(' + sizeH + ')');
					$('#game iframe').css('top', ((((sizeH*800)-800)/2)+56+'px'));
					$('#game iframe').css('left', ((((sizeH*600)-600)/2)+'px'));
				}
				break;
				
			case 'twodots':
				var w = window.innerWidth,
					h = window.innerHeight;
				var sizeW = (w/500),
					sizeH = (h/(500+56));
					
				if(sizeW < sizeH){
					$('#game iframe').css('transform', 'scale(' + sizeW + ')');
					$('#game iframe').css('top', ((((sizeW*500)-500)/2)+56+'px'));
					$('#game iframe').css('left', ((((sizeW*500)-500)/2)+'px'));
				}else{
					$('#game iframe').css('transform', 'scale(' + sizeH + ')');
					$('#game iframe').css('top', ((((sizeH*500)-500)/2)+56+'px'));
					$('#game iframe').css('left', ((((sizeH*500)-500)/2)+'px'));
				}
				break;
		}
		
		if(gameTimer == 0){
			gameInterval = window.setInterval(function(){
				gameTimer++;
				
				if(gameTimer>59){
					if(c(STORAGE.getItem('data'))){
						var DATA = JSON.parse(STORAGE.getItem('data'));
						var curCoin = b(Object.keys(DATA.coin)[1]);
						
						if(curCoin<1){
							apps.dialog.alert('Not enough coin. :(', '');
						}else{
							curCoin--;
							var E = sys.genStr(6), T = sys.genStr(5), S = a(curCoin), G = md5(S), J = sys.genStr(6), Q = curCoin, F = true, K = false;
							
							DATA.coin = {};
							DATA.coin[T] = F;
							DATA.coin[S] = K;
							DATA.coin[J] = Q;
							DATA.coin[E] = G;
							STORAGE.setItem('data', JSON.stringify(DATA));
							
							$('#wooho-coin').find('.fab-text').text(Q);
						}
					}else{
						STORAGE.removeItem('data');
						location.reload();
					}
					gameTimer = 0;
				}
			}, 1000);
		}
		apps.dialog.close();
	},
	'genStr' : function(num){
		var result = '';
		var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for(var i = 0;i < num;i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	},
	'genNum' : function(num){
		var result = '';
		var characters = '0123456789';
		var charactersLength = characters.length;
		for(var i = 0;i < num;i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}
}