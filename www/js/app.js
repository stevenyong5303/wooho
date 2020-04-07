var $$ = Dom7;
var sys = new Object();
var STORAGE = window.localStorage;
var requestInterval, requestTimer = 0, gameInterval, gameTimer = 0, adInterval, adTimer = 0;
var apps = new Framework7({
			root: '#app',
			id: 'com.wkv.game',
			name: 'WOOHO',
			theme: 'md',
			version: "1.0.24",
			rtl: false,
			language: "en-US"
		});
var msgPracticeConfirm = {
		'en' : 'Deduct 1 Star per minute?',
		'bm' : 'Gunakan 1 Star seminit?',
		'cn' : '每分钟扣除 1 颗 Star ？',
		'tm' : 'நிமிடத்திற்கு 1 Star ஐக் கழிக்கவா?'
	},
	msgNotEnough = {
		'en' : 'Not enough Star. :(',
		'bm' : 'Tidak cukup Star. :(',
		'cn' : 'Star 不够。 :(',
		'tm' : 'போதுமான Star இல்லை. :('
	},
	msgRestart = {
		'en' : 'Restart game?',
		'bm' : 'Mulakan semula？',
		'cn' : '重新启动游戏？',
		'tm' : 'விளையாட்டை மறுதொடக்கம் செய்யவா?'
	},
	msgEarn = {
		'en' : 'Yay, you earn 10 Star!',
		'bm' : 'Tahniah, anda mendapat 10 Star!',
		'cn' : '哇，您获得10 Star！',
		'tm' : 'வாழ்த்துக்கள், நீங்கள் 10 Star சம்பாதிக்கிறீர்கள்!'
	},
	msgEarnError = {
		'en' : 'Watch advertisement for 30 seconds to earn Star.',
		'bm' : 'Tonton iklan selama 30 saat untuk mendapatkan Star.',
		'cn' : '观看广告30秒钟即可赚取Star。',
		'tm' : 'Star சம்பாதிக்க 30 விநாடிகள் விளம்பரத்தைப் பாருங்கள்.'
	};
var admobid = {
				banner: 'ca-app-pub-7511151038516922/6165804865',
				interstitial: 'ca-app-pub-7511151038516922/3548408058',
				rewardvideo: 'ca-app-pub-7511151038516922/6238150573'
			};
		  
var app = {
    initialize: function() {
        this.bindEvents();
    },
	
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
	
    onDeviceReady: function(){
        app.receivedEvent('deviceready');
		
		admob.banner.config({
			id: admobid.banner,
			isTesting: true,
			autoShow: true
		})
		admob.banner.prepare();

		admob.interstitial.config({
			id: admobid.interstitial,
			isTesting: true,
			autoShow: false
		})
		admob.interstitial.prepare();
		
		admob.rewardvideo.config({
			id: admobid.rewardvideo,
			isTesting: true,
			autoShow: false
		})
		admob.rewardvideo.prepare()
		
		window.open = cordova.InAppBrowser.open;
		document.addEventListener("backbutton", sys.onBackKeyDown, false);
		
		$('.btn-ecn').addClass('disabled');
		$('.btn-ecn').prop('disabled', true);
		
		document.addEventListener('admob.banner.events.LOAD', function(event){
			// admob.banner.show();
		});
		
		document.addEventListener('admob.banner.events.CLOSE', function(event){
			admob.banner.prepare();
		});
		
		document.addEventListener('admob.interstitial.events.LOAD', function(event){
			$('.btn-ecn').removeClass('disabled');
			$('.btn-ecn').prop('disabled', false);
		});
		
		document.addEventListener('admob.interstitial.events.OPEN', function(event){
			adInterval = window.setInterval(function(){ adTimer++; }, 1000);
		});
		
		document.addEventListener('admob.interstitial.events.CLOSE', function(event){
			if(adTimer >= 30){
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
				
				apps.toast.create({
					icon: '<i class="material-icons">stars</i>',
					text: msgEarn[JSON.parse(STORAGE.getItem('data')).configuration.language],
					position: 'center',
					closeTimeout: 2000,
				}).open();
				
				window.clearInterval(adInterval);
				adTimer = 0;
			}else{
				apps.toast.create({
					icon: '<i class="material-icons">sentiment_very_dissatisfied</i>',
					text: msgEarnError[JSON.parse(STORAGE.getItem('data')).configuration.language],
					position: 'center',
					closeTimeout: 2000,
				}).open();
				
				window.clearInterval(adInterval);
				adTimer = 0;
			}
			
			$('.btn-ecn').addClass('disabled');
			$('.btn-ecn').prop('disabled', true);
			admob.interstitial.prepare();
		});
		
		document.addEventListener('admob.rewardvideo.events.LOAD', function(event){
			
		});

		document.addEventListener('admob.rewardvideo.events.CLOSE', function(event){
			
		});
		
		document.addEventListener('admob.rewardvideo.events.REWARD', function(event){
			
		});
    },
	
    receivedEvent: function(id){
        console.log('Received Event: ' + id);
		
    }
};

$(document).ready(function(){
	var ajaxData = '', postAjaxData = '';
		
	// Welcome Page
	
	$('.wcm-btn-lgg').on('click', function(){
		var cur = $('#wcm').data('lgg');
		
		if(cur == 'en'){
			$('#wcm').data('lgg', 'bm');
			cur = 'bm';
		}else if(cur == 'bm'){
			$('#wcm').data('lgg', 'cn');
			cur = 'cn';
		}else if(cur == 'cn'){
			$('#wcm').data('lgg', 'tm');
			cur = 'tm';
		}else{
			$('#wcm').data('lgg', 'en');
			cur = 'en';
		}
		
		$('.translate').each(function(){
			$(this).text($(this).data(cur));
		});
		
		$('.translate-placeholder input').each(function(){
			$(this).attr('placeholder', $(this).data(cur));
		});
		
		$('.translate-error input').each(function(){
			$(this)[0].dataset.errorMessage = $(this).data(('e'+cur));
		});
	});
	
	$('input.wcm-psk').on('keyup', function(){
		$('.input-state').css('background-image', 'none');
		
		if($(this).val().length == 5){
			var psk = parseInt($(this).val()),
				state = 'malaysia';
			
			if(psk >= 50000 && psk <= 60000){
				state = 'kualalumpur';
			}else if(psk >= 62300 && psk <= 62988){
				state = 'putrajaya';
			}else if(psk >= 87000 && psk <= 87034){
				state = 'labuan';
			}else if((psk >= 40000 && psk <= 48300) || (psk >= 63000 && psk <= 68100)){
				state = 'selangor';
			}else if(psk >= 20000 && psk <= 24300){
				state = 'terengganu';
			}else if(psk >= 93000 && psk <= 98859){
				state = 'sarawak';
			}else if(psk >= 88000 && psk <= 91309){
				state = 'sabah';
			}else if(psk >= 5000 && psk <= 9810){
				state = 'kedah';
			}else if(psk >= 15000 && psk <= 18500){
				state = 'kelantan';
			}else if(psk >= 70000 && psk <= 73509){
				state = 'negerisembilan';
			}else if(psk >= 10000 && psk <= 14400){
				state = 'penang';
			}else if(psk >= 79000 && psk <= 86900){
				state = 'johor';
			}else if(psk >= 75000 && psk <= 78309){
				state = 'melacca';
			}else if(psk >= 1000 && psk <= 2999){
				state = 'perlis';
			}else if(psk >= 30000 && psk <= 36810){
				state = 'perak';
			}else if((psk >= 25000 && psk <= 28800) || (psk >= 39000 && psk <= 39200) || psk == 49000 || psk == 69000){
				state = 'pahang';
			}
			
			$('.input-state').css('background-image', ('url(img/state/' + state + '.png)'));
			$('input.wcm-psk').data('state', state);
		}
	});
	
	$('.wcm-vfc').on('keyup', function(){
		var vfc = $(this).val();
		
		if(sys.isEmpty(vfc)){
			$('.wcm-btn-lgn').parent('p.row').hide();
			$('.wcm-btn-rvc').parent('p.row').show();
		}else{
			$('.wcm-btn-rvc').parent('p.row').hide();
			$('.wcm-btn-lgn').parent('p.row').show();
		}
	});
	
	$('.wcm-btn-rvc').on('click', function(){
		var ctn = $('input.wcm-ctn').val(),
			lgg = $('#wcm').data('lgg');
		
		if(!sys.isEmpty(ctn)){
			var ctnStr = ctn + '';
			
			if((ctnStr.charAt(0) == '0') && (ctnStr.charAt(1) == '1') && ((ctnStr.length == 10) || (ctnStr.length == 11))){
				var DATA = JSON.parse(STORAGE.getItem('data'));
					
				ajaxData = {
					'ctn' : ctn,
					'uid' : DATA.profile.uid
				};
				postAjaxData = "ACT=" + encodeURIComponent('request_verification')
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
						
						if(str.indexOf('200 OK') != -1){
							$('.wcm-btn-rvc').prop('disabled', true);
							$('.wcm-btn-rvc').addClass('disabled');
							$('.wcm-btn-rvc').data('verification', str.substr(8,32));
							$('.wcm-btn-rvc').data('contact', ctn);
							STORAGE.setItem('woohoTempId', str.substr(8,32));
							
							var sucStr = '';
							
							if(lgg=='bm'){
								sucStr = ('Kod pengesahan akan dihantar ke +6' + ctn + ' dalam satu minit.');
							}else if(lgg=='cn'){
								sucStr = ('验证码将在一分钟内发送给+6' + ctn + '。');
							}else if(lgg=='tm'){
								sucStr = ('சரிபார்ப்புக் குறியீடு ஒரு நிமிடத்தில் +6' + ctn + ' க்கு அனுப்பப்படும்.');
							}else{
								sucStr = ('The verification code will send to +6' + ctn + ' in a minute.');
							}
							
							apps.toast.create({
								icon: '<i class="material-icons">email</i>',
								text: sucStr,
								position: 'center',
								closeTimeout: 15000,
							}).open();
							
							requestInterval = window.setInterval(function(){
								requestTimer++;
								
								if(requestTimer>120){
									window.clearInterval(requestInterval);
									requestTimer = 0;
									$('.wcm-btn-rvc').prop('disabled', false);
									$('.wcm-btn-rvc').removeClass('disabled');
								}
							}, 1000);
						}else{
							apps.toast.create({
								icon: '<i class="material-icons">bug_report</i>',
								text: 'Server error!',
								position: 'center',
								closeTimeout: 1000,
							}).open();
						}
					}
				});
			}else{
				var str = '';
				
				if(lgg=='bm'){
					str = 'Nombor telefon tidak sah.';
				}else if(lgg=='cn'){
					str = '联系电话无效。';
				}else if(lgg=='tm'){
					str = 'தவறான தொடர்பு எண்.';
				}else{
					str = 'Invalid contact number.';
				}
				
				apps.toast.create({
					icon: '<i class="material-icons">cancel</i>',
					text: str,
					position: 'center',
					closeTimeout: 1000,
				}).open();
			}
		}else{
			var str = '';
			
			if(lgg=='bm'){
				str = 'Nombor telefon tidak boleh dibiarkan kosong.';
			}else if(lgg=='cn'){
				str = '联系电话不能为空。';
			}else if(lgg=='tm'){
				str = 'தொடர்பு எண்ணை காலியாக விட முடியாது.';
			}else{
				str = 'Contact number cannot be leave empty.';
			}
			
			apps.toast.create({
				icon: '<i class="material-icons">cancel</i>',
				text: str,
				position: 'center',
				closeTimeout: 1000,
			}).open();
		}
	});
	
	$('.wcm-btn-lgn').on('click', function(){
		var usn = $('input.wcm-usn').val(),
			state = $('input.wcm-psk').data('state'),
			vfc = $('input.wcm-vfc').val(),
			lgg = $('#wcm').data('lgg');
		
		if(!sys.isEmpty(usn)){
			if(!sys.isEmpty($('input.wcm-psk').val())){
				if(md5((vfc + '-' + $('input.wcm-ctn').val())) == STORAGE.getItem('woohoTempId')){
					var DATA = JSON.parse(STORAGE.getItem('data'));
					var uid = DATA.profile.uid;
					
					ajaxData = {
						'ctn' : $('input.wcm-ctn').val(),
						'vfc' : vfc,
						'uid' : DATA.profile.uid
					};
					postAjaxData = "ACT=" + encodeURIComponent('check_verification')
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
							
							if(str == '200 OK'){
								var DATA = {
									'profile': {
										'username' : usn,
										'contact' : $('input.wcm-ctn').val(),
										'state' : $('input.wcm-psk').data('state'),
										'uid' : uid
									},
									'configuration' : {
										'language' : lgg,
										'sound' : true
									},
									'coin' : {
										'gY8aH' : true,
										'YgjQ' : false,
										'TadCax' : 50,
										'SgQwef' : 'b961685dc6333717d9d8adb3b358a4e7'
									}
								};
								
								STORAGE.setItem('data', JSON.stringify(DATA));
								STORAGE.removeItem('woohoTempId');
								
								var sucStr = '';
								
								if(lgg=='bm'){
									sucStr = ('Hello ' + usn + '! Selamat datang ke WOOHO.');
								}else if(lgg=='cn'){
									sucStr = (usn + '，您好！欢迎来到WOOHO。');
								}else if(lgg=='tm'){
									sucStr = ('வணக்கம் ' + usn + '! WOOHO க்கு வருக.');
								}else{
									sucStr = ('Hello ' + usn + '! Welcome to WOOHO.');
								}
								
								apps.toast.create({
									icon: '<i class="material-icons">done_outline</i>',
									text: sucStr,
									position: 'center',
									closeTimeout: 2000,
								}).open();
								
								setTimeout(function(){ location.reload(); }, 2500);
							}else{
								apps.toast.create({
									icon: '<i class="material-icons">bug_report</i>',
									text: 'Server error!',
									position: 'center',
									closeTimeout: 1000,
								}).open();
							}
						}
					});
				}else{
					if(lgg=='bm'){
						str = 'Kod pengesahan tidak sah.';
					}else if(lgg=='cn'){
						str = '验证码无效。';
					}else if(lgg=='tm'){
						str = 'தவறான பயனர்பெயர்.';
					}else{
						str = 'Invalid verification code.';
					}
					
					apps.toast.create({
						icon: '<i class="material-icons">cancel</i>',
						text: str,
						position: 'center',
						closeTimeout: 1000,
					}).open();
				}
			}else{
				if(lgg=='bm'){
					str = 'Poskod tidak sah.';
				}else if(lgg=='cn'){
					str = '邮政编码无效。';
				}else if(lgg=='tm'){
					str = 'தவறான அஞ்சல் குறியீடு.';
				}else{
					str = 'Invalid postal code.';
				}
				
				apps.toast.create({
					icon: '<i class="material-icons">cancel</i>',
					text: str,
					position: 'center',
					closeTimeout: 1000,
				}).open();
			}
		}else{
			if(lgg=='bm'){
				str = 'Sila isikan nama pengguna anda.';
			}else if(lgg=='cn'){
				str = '请填写您的用户名。';
			}else if(lgg=='tm'){
				str = 'இந்த புலத்தை நிரப்பவும்.';
			}else{
				str = 'Please fill out the username.';
			}
			
			apps.toast.create({
				icon: '<i class="material-icons">cancel</i>',
				text: str,
				position: 'center',
				closeTimeout: 1000,
			}).open();
		}
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
				
				if(admob){
					admob.banner.show();
				}
			}
		});
	});
	
	$('#game .navbar .link.replay').on('click', function(){
		apps.dialog.confirm(msgRestart[JSON.parse(STORAGE.getItem('data')).configuration.language], '', function(){
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
		apps.dialog.confirm((msgPracticeConfirm[JSON.parse(STORAGE.getItem('data')).configuration.language]), '', function () {
			if(c(STORAGE.getItem('data'))){
				var DATA = JSON.parse(STORAGE.getItem('data'));
				var curCoin = b(Object.keys(DATA.coin)[1]);
				
				if(curCoin<1){
					apps.dialog.close();
					apps.dialog.alert((msgNotEnough[JSON.parse(STORAGE.getItem('data')).configuration.language]), '');
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
		apps.dialog.confirm((msgPracticeConfirm[JSON.parse(STORAGE.getItem('data')).configuration.language]), '', function () {
			if(c(STORAGE.getItem('data'))){
				var DATA = JSON.parse(STORAGE.getItem('data'));
				var curCoin = b(Object.keys(DATA.coin)[1]);
				
				if(curCoin<1){
					apps.dialog.close();
					apps.dialog.alert((msgNotEnough[JSON.parse(STORAGE.getItem('data')).configuration.language]), '');
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
		apps.dialog.confirm((msgPracticeConfirm[JSON.parse(STORAGE.getItem('data')).configuration.language]), '', function () {
			if(c(STORAGE.getItem('data'))){
				var DATA = JSON.parse(STORAGE.getItem('data'));
				var curCoin = b(Object.keys(DATA.coin)[1]);
				
				if(curCoin<1){
					apps.dialog.close();
					apps.dialog.alert((msgNotEnough[JSON.parse(STORAGE.getItem('data')).configuration.language]), '');
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
		apps.dialog.confirm((msgPracticeConfirm[JSON.parse(STORAGE.getItem('data')).configuration.language]), '', function () {
			if(c(STORAGE.getItem('data'))){
				var DATA = JSON.parse(STORAGE.getItem('data'));
				var curCoin = b(Object.keys(DATA.coin)[1]);
				
				if(curCoin<1){
					apps.dialog.close();
					apps.dialog.alert((msgNotEnough[JSON.parse(STORAGE.getItem('data')).configuration.language]), '');
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
		apps.dialog.confirm((msgPracticeConfirm[JSON.parse(STORAGE.getItem('data')).configuration.language]), '', function () {
			if(c(STORAGE.getItem('data'))){
				var DATA = JSON.parse(STORAGE.getItem('data'));
				var curCoin = b(Object.keys(DATA.coin)[1]);
				
				if(curCoin<1){
					apps.dialog.close();
					apps.dialog.alert((msgNotEnough[JSON.parse(STORAGE.getItem('data')).configuration.language]), '');
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
		apps.dialog.confirm((msgPracticeConfirm[JSON.parse(STORAGE.getItem('data')).configuration.language]), '', function () {
			if(c(STORAGE.getItem('data'))){
				var DATA = JSON.parse(STORAGE.getItem('data'));
				var curCoin = b(Object.keys(DATA.coin)[1]);
				
				if(curCoin<1){
					apps.dialog.close();
					apps.dialog.alert((msgNotEnough[JSON.parse(STORAGE.getItem('data')).configuration.language]), '');
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
		apps.dialog.confirm((msgPracticeConfirm[JSON.parse(STORAGE.getItem('data')).configuration.language]), '', function () {
			if(c(STORAGE.getItem('data'))){
				var DATA = JSON.parse(STORAGE.getItem('data'));
				var curCoin = b(Object.keys(DATA.coin)[1]);
				
				if(curCoin<1){
					apps.dialog.close();
					apps.dialog.alert((msgNotEnough[JSON.parse(STORAGE.getItem('data')).configuration.language]), '');
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
		apps.dialog.confirm((msgPracticeConfirm[JSON.parse(STORAGE.getItem('data')).configuration.language]), '', function () {
			if(c(STORAGE.getItem('data'))){
				var DATA = JSON.parse(STORAGE.getItem('data'));
				var curCoin = b(Object.keys(DATA.coin)[1]);
				
				if(curCoin<1){
					apps.dialog.close();
					apps.dialog.alert((msgNotEnough[JSON.parse(STORAGE.getItem('data')).configuration.language]), '');
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
		apps.dialog.confirm((msgPracticeConfirm[JSON.parse(STORAGE.getItem('data')).configuration.language]), '', function () {
			if(c(STORAGE.getItem('data'))){
				var DATA = JSON.parse(STORAGE.getItem('data'));
				var curCoin = b(Object.keys(DATA.coin)[1]);
				
				if(curCoin<1){
					apps.dialog.close();
					apps.dialog.alert((msgNotEnough[JSON.parse(STORAGE.getItem('data')).configuration.language]), '');
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
		if(c(STORAGE.getItem('data'))){
			admob.interstitial.show();
		}else{
			apps.toast.create({
				icon: '<i class="material-icons">bug_report</i>',
				text: 'Coin error detected!',
				position: 'center',
				closeTimeout: 1000,
			}).open();
			
			var DATA = JSON.parse(STORAGE.getItem('data'));
			
			DATA.coin = {
					'gY8aH' : true,
					'Pd4' : false,
					'TadCax' : 0,
					'SgQwef' : 'e6d7362cde8aaaaba606825eeccdd506'
				}
			STORAGE.setItem('data', JSON.stringify(DATA));
			
			setTimeout(function(){ location.reload(); }, 1000);
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
		var stateList = ['malaysia', 'kualalumpur', 'putrajaya', 'labuan', 'perlis', 'kedah', 'terengganu', 'penang', 'kelantan', 'perak', 'pahang', 'selangor', 'negerisembilan', 'melacca', 'johor', 'sabah', 'sarawak'];
		var num = stateList.indexOf(DATA.profile.state);
		
		if(num != -1){
			if(num==16){
				num=0;
			}else{
				num++;
			}
			DATA.profile.state = stateList[num];
		}else{
			DATA.profile.state = 'malaysia';
		}
		$('img.state').attr('src', ('img/state/' + DATA.profile.state + '.png'));
		STORAGE.setItem('data', JSON.stringify(DATA));
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
		apps.loginScreen.open($('#wcm'), true);
		
		var DATA = {
			'profile' : {
				'uid' : sys.genStr(32)
			}
		}
		
		STORAGE.setItem('data', JSON.stringify(DATA));
	}else{
		var DATA = JSON.parse(STORAGE.getItem('data'));
		
		if(sys.isEmpty(DATA.profile.contact)){
			apps.loginScreen.open($('#wcm'), true);
		}else{
			$('#wooho-coin').find('.fab-text').text(b(Object.keys(JSON.parse(STORAGE.getItem('data')).coin)[1]));
			
			$('.btn-stc-usn').find('.item-after').text(DATA.profile.username);
			$('.btn-stc-ctn').find('.item-after').text(('+6' + DATA.profile.contact));
			$('.btn-stc-stt').find('.item-after').html(('<img class="state" src="img/state/'+DATA.profile.state+'.png" width="36" height="36"/>'));
			
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
			
			$('.view-main').css('opacity', '1');
		}
	}
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
		if($('.login-screen.modal-in').length != 0){
			window.clearInterval(gameInterval);
			apps.loginScreen.close();
			
			return false;
		}else{
			window.close();
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
				
				if(!(JSON.parse(STORAGE.getItem('data')).configuration.sound)){
					$('#sound', $('#game .iframe iframe').contents()).remove();
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
				
				if(!(JSON.parse(STORAGE.getItem('data')).configuration.sound)){
					$('#game iframe')[0].contentWindow.buzz.all().setVolume(0);
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
				
				if(!(JSON.parse(STORAGE.getItem('data')).configuration.sound)){
					$('#game iframe')[0].contentWindow.GROUP_SOUND.mute();
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
				
				if(!(JSON.parse(STORAGE.getItem('data')).configuration.sound)){
					$('#sound', $('#game .iframe iframe').contents()).remove();
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
				
				if(!(JSON.parse(STORAGE.getItem('data')).configuration.sound)){
					$('#sound', $('#game .iframe iframe').contents()).remove();
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
				if(!(JSON.parse(STORAGE.getItem('data')).configuration.sound)){
					$('#audio-resources', $('#game .iframe iframe').contents()).remove();
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
				if(!(JSON.parse(STORAGE.getItem('data')).configuration.sound)){
					$('#woohoSound', $('#game .iframe iframe').contents()).remove();
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
				if(!(JSON.parse(STORAGE.getItem('data')).configuration.sound)){
					$('#sound', $('#game .iframe iframe').contents()).remove();
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
							apps.dialog.alert((msgNotEnough[JSON.parse(STORAGE.getItem('data')).configuration.language]), '');
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
		if(admob){
			admob.banner.hide();
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