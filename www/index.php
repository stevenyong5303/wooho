<?php
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');

	include 'functions.php';
	
	if($_POST){
		if(isset($_POST['ACT'])){
			switch($_POST['ACT']){
				case 'pnw_score':
					$DATA = unserialize(stripslashes($_POST['DATA']));
					$game_id = addQuotes(strtolower($DATA['game']));
					$user_id = addQuotes($DATA['usr']);
					$user_state = addQuotes(strtolower($DATA['state']));
					$score = addQuotes(strtolower($DATA['score']));
					$coupon = addQuotes(strtolower($DATA['coupon']));
					
					$sql = ' INSERT INTO score_list ' .
						   ' (game_id, user_id, user_state, score, playnwin) ' .
						   ' VALUES ( ' . $game_id . ', ' . $user_id . ', ' . $user_state . ', ' . $score . ', ' . $coupon . ' ); ';
					
					if($result = $mysqli->query($sql)){
						echo '200 OK';
					}else{
						echo '406 Not Acceptable';
					}
					break;
					
				case 'pnw_result':
					$DATA = unserialize(stripslashes($_POST['DATA']));
					$connect_id = ($DATA['connect']);
					
					$sql = ' SELECT `playnwin`, MAX(`score`) AS maxScore ' .
						   ' FROM score_list ' .
						   ' WHERE `playnwin` <> 0 ' .
						   ' AND datetime BETWEEN ( NOW() - INTERVAL 2 HOUR ) and NOW() ' .
						   ' GROUP BY `playnwin`; ';
					
					if($result = $mysqli->query($sql)){
						if($row = $result->fetch_array(MYSQLI_ASSOC)){
							$i = 0;
							$score[$i] = $row;
							$i++;
							
							while($row = $result->fetch_array(MYSQLI_ASSOC)){
								$score[$i] = $row;
								$i++;
							}
							
							$result->close();
							
							usort($score, function($a, $b){
								if ((int)$a['maxScore'] == (int)$b['maxScore']) {
									return 0;
								}
								return ((int)$a['maxScore'] < (int)$b['maxScore']) ? 1 : -1;
							});
							
							for($i = 0; $i < count($score); $i++){
								$sql = ' SELECT `user_id`, `user_state`, `playnwin`, `score` ' .
									   ' FROM score_list ' .
									   ' WHERE `playnwin` = "' . $score[$i]['playnwin'] . '" ' .
									   ' AND datetime BETWEEN ( NOW() - INTERVAL 2 HOUR ) and NOW() ' .
									   ' ORDER BY `score` DESC; ';
								
								if($result = $mysqli->query($sql)){
									if($row = $result->fetch_array(MYSQLI_ASSOC)){
										$score[$i]['user_id'] = $row['user_id'];
										$score[$i]['user_state'] = $row['user_state'];
										
										$result->close();
									}
								}
							}
							$report = $score;
						}else{
							$report = [];
						}
					}else{
						echo '406 Not Acceptable';
					}
					
					echo json_encode($report);
					break;
					
				case 'coupon_check':
					$DATA = unserialize(stripslashes($_POST['DATA']));
					$user_id = addQuotes($DATA['usr']);
					$user_state = addQuotes(strtolower($DATA['state']));
					$coupon = $DATA['coupon'];
						   
					$coupon_list = array(428719, 658143, 471222, 986195,
									     897565, 585141, 494690, 202340,
										 439522, 113121, 146368, 700765,
										 518171, 881299, 315706, 709317,
										 786258, 183509, 121340, 326257,
										 469913, 733793, 458019, 114237,
										 464319, 471325, 114565, 834646,
										 592037, 579993, 454194, 148368,
										 496306, 384514, 413899, 649341,
										 909956, 670524, 327995, 681592,
										 743972, 727224, 727101, 804858,
										 857842, 638217, 437604, 309530,
										 379588, 782709, 535422, 736476,
										 430279, 737203, 630295, 180200, 657251,
										 470730, 207836, 693274, 400891, 555271,
										 414561, 609760, 440376, 942588, 194492,
										 135396, 883909, 839168, 738035, 419336,
										 734969, 891866, 120434, 891153, 101109,
										 271307, 243644, 918268, 542319, 277213,
										 935980, 824318, 928491, 280171, 532239);
					
					if(in_array($coupon, $coupon_list)){
						echo '200 OK';
					}else{
						echo '406 Not Acceptable';
					}
					break;
					
				case 'upload_score':
					$DATA = unserialize(stripslashes($_POST['DATA']));
					$game_id = addQuotes(strtolower($DATA['game']));
					$user_id = addQuotes($DATA['usr']);
					$user_state = addQuotes(strtolower($DATA['state']));
					$score = addQuotes(strtolower($DATA['score']));
					
					$sql = ' INSERT INTO score_list ' .
						   ' (game_id, user_id, user_state, score) ' .
						   ' VALUES ( ' . $game_id . ', ' . $user_id . ', ' . $user_state . ', ' . $score . ' ); ';
					
					if($result = $mysqli->query($sql)){
						echo '200 OK';
					}else{
						echo '406 Not Acceptable';
					}
					break;
					
				case 'upload_check_score':
					$DATA = unserialize(stripslashes($_POST['DATA']));
					$game_id = addQuotes(strtolower($DATA['game']));
					$user_id = addQuotes($DATA['usr']);
					$user_state = addQuotes(strtolower($DATA['state']));
					$score = addQuotes(strtolower($DATA['score']));
					
					$sql = ' INSERT INTO score_list ' .
						   ' (game_id, user_id, user_state, score) ' .
						   ' VALUES ( ' . $game_id . ', ' . $user_id . ', ' . $user_state . ', ' . $score . ' ); ';
						   
					if($result = $mysqli->query($sql)){
						$sql = ' SELECT user_id, user_state, score FROM score_list ' .
							   ' WHERE game_id = ' . $game_id . ' ' . 
							   ' AND datetime BETWEEN ( NOW() - INTERVAL 1 MONTH ) and NOW() ' . 
							   ' ORDER BY `score` DESC, `user_id` ASC ' .
							   ' LIMIT 10; ';
						
						if($result = $mysqli->query($sql)){
							if($row = $result->fetch_array(MYSQLI_ASSOC)){
								$i = 0;
								$day30[$i] = $row;
								$i++;
								
								while($row = $result->fetch_array(MYSQLI_ASSOC)){
									$day30[$i] = $row;
									$i++;
								}
								
								$result->close();
								$report['day30'] = $day30;
							}else{
								$report['day30'] = false;
							}
						}else{
							echo '400 Bad Request';
						}
						
						$sql = ' SELECT user_id, user_state, score FROM score_list ' .
							   ' WHERE game_id = ' . $game_id . ' ' . 
							   ' AND datetime BETWEEN ( NOW() - INTERVAL 7 DAY ) and NOW() ' . 
							   ' ORDER BY `score` DESC, `user_id` ASC ' .
							   ' LIMIT 10; ';
							   
						if($result = $mysqli->query($sql)){
							if($row = $result->fetch_array(MYSQLI_ASSOC)){
								$i = 0;
								$day7[$i] = $row;
								$i++;
								
								while($row = $result->fetch_array(MYSQLI_ASSOC)){
									$day7[$i] = $row;
									$i++;
								}
								
								$result->close();
								$report['day7'] = $day7;
							}else{
								$report['day7'] = false;
							}
						}else{
							echo '400 Bad Request';
						}
						
						$sql = ' SELECT user_id, user_state, score FROM score_list ' .
							   ' WHERE game_id = ' . $game_id . ' ' . 
							   ' AND datetime BETWEEN ( NOW() - INTERVAL 1 DAY ) and NOW() ' . 
							   ' ORDER BY `score` DESC, `user_id` ASC ' .
							   ' LIMIT 10; ';
							   
						if($result = $mysqli->query($sql)){
							if($row = $result->fetch_array(MYSQLI_ASSOC)){
								$i = 0;
								$day1[$i] = $row;
								$i++;
								
								while($row = $result->fetch_array(MYSQLI_ASSOC)){
									$day1[$i] = $row;
									$i++;
								}
								
								$result->close();
								$report['day1'] = $day1;
							}else{
								$report['day1'] = false;
							}
						}else{
							echo '400 Bad Request';
						}
						
						echo json_encode($report);
					}else{
						echo '406 Not Acceptable';
					}
					break;
					
				case 'check_score':
					$sql = ' SELECT user_id, user_state, score, game_id FROM score_list ' .
						   ' WHERE datetime BETWEEN ( NOW() - INTERVAL 1 MONTH ) and NOW() ' . 
						   ' ORDER BY `game_id` ASC, `score` DESC, `user_id` ASC; ';
					
					if($result = $mysqli->query($sql)){
						if($row = $result->fetch_array(MYSQLI_ASSOC)){
							$i = 0;
							$day30[$i] = $row;
							$i++;
							
							while($row = $result->fetch_array(MYSQLI_ASSOC)){
								$day30[$i] = $row;
								$i++;
							}
							
							$result->close();
							$report['day30'] = saparateGame($day30);
						}else{
							$report['day30'] = false;
						}
					}else{
						echo '400 Bad Request';
					}
					
					$sql = ' SELECT user_id, user_state, score, game_id FROM score_list ' .
						   ' WHERE datetime BETWEEN ( NOW() - INTERVAL 7 DAY ) and NOW() ' . 
						   ' ORDER BY `game_id` ASC, `score` DESC, `user_id` ASC; ';
						   
					if($result = $mysqli->query($sql)){
						if($row = $result->fetch_array(MYSQLI_ASSOC)){
							$i = 0;
							$day7[$i] = $row;
							$i++;
							
							while($row = $result->fetch_array(MYSQLI_ASSOC)){
								$day7[$i] = $row;
								$i++;
							}
							
							$result->close();
							$report['day7'] = saparateGame($day7);
						}else{
							$report['day7'] = false;
						}
					}else{
						echo '400 Bad Request';
					}
					
					$sql = ' SELECT user_id, user_state, score, game_id FROM score_list ' .
						   ' WHERE datetime BETWEEN ( NOW() - INTERVAL 1 DAY ) and NOW() ' . 
						   ' ORDER BY `game_id` ASC, `score` DESC, `user_id` ASC; ';
						   
					if($result = $mysqli->query($sql)){
						if($row = $result->fetch_array(MYSQLI_ASSOC)){
							$i = 0;
							$day1[$i] = $row;
							$i++;
							
							while($row = $result->fetch_array(MYSQLI_ASSOC)){
								$day1[$i] = $row;
								$i++;
							}
							
							$result->close();
							$report['day1'] = saparateGame($day1);
						}else{
							$report['day1'] = false;
						}
					}else{
						echo '400 Bad Request';
					}
					
					echo json_encode($report);
					break;
			}
		}
	}else{
		// if(stristr($_SERVER['HTTP_USER_AGENT'],'Android') || stristr($_SERVER['HTTP_USER_AGENT'],'iPhone') || stristr($_SERVER['HTTP_USER_AGENT'],'Windows NT')){ 
?>

<!DOCTYPE html>
<html>
<head>
	<!-- Global site tag (gtag.js) - Google Analytics -->
	<meta charset="utf-8" />
	<meta name="format-detection" content="telephone=no" />
	<meta name="msapplication-tap-highlight" content="no" />
	<meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width" />
	<title>WOOHO</title>
	<link rel="icon" href="icon.png">
	<meta name="apple-mobile-web-app-title" content="Wooho" />
	<meta name="apple-mobile-web-app-capable" content="yes">
	<meta name="apple-mobile-web-app-status-bar-style" content="black" />
	<link rel="apple-touch-icon" href="icon.png">
	<link rel="apple-touch-icon" sizes="76x76" href="icon.png">
	<link rel="apple-touch-icon" sizes="120x120" href="icon.png">
	<link rel="apple-touch-icon" sizes="152x152" href="icon.png">
	<link rel="stylesheet" href="framework7/css/framework7.min.css">
	<link rel="stylesheet" href="css/icons.css">
	<link rel="stylesheet" href="css/app.css">
	<meta name="propeller" content="cf54b56e40df143e8617362372689bd6">
	<script async src="https://www.googletagmanager.com/gtag/js?id=G-4C17T6BLHF"></script>
	<script>
	  window.dataLayer = window.dataLayer || [];
	  function gtag(){dataLayer.push(arguments);}
	  gtag('js', new Date());

	  gtag('config', 'G-4C17T6BLHF');
	</script>
	<script data-ad-client="ca-pub-7511151038516922" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
</head>
<body class="color-theme-gray">
	<div class="popover popover-leaderboard">
		<div class="popover-inner">
			<div class="toolbar tabbar toolbar-top">
				<div class="toolbar-inner">
					<a href="#scoreDay" class="tab-link tab-link-active translate" data-en="Day" data-bm="Hari" data-cn="天" data-tm="நாள்">Day</a>
					<a href="#scoreWeek" class="tab-link translate" data-en="Week" data-bm="Minggu" data-cn="周" data-tm="வாரம்">Week</a>
					<a href="#scoreMonth" class="tab-link translate" data-en="Month" data-bm="Bulan" data-cn="月" data-tm="மாதம்">Month</a>
				</div>
			</div>
			<div class="tabs">
				<div class="tabs">
					<div id="scoreDay" class="page-content tab tab-active"></div>
					<div id="scoreWeek" class="page-content tab"></div>
					<div id="scoreMonth" class="page-content tab"></div>
				</div>
			</div>
		</div>
	</div>
	<div id="app">
		<div class="statusbar"></div>
		<div id="game" class="login-screen">
			<div class="view">
				<div class="navbar">
					<div class="navbar-bg"></div>
					<div class="navbar-inner sliding">
						<div class="left">
							<a class="link back">
								<i class="icon icon-back"></i>
								<span class="if-not-md"></span>
							</a>
						</div>
						<div class="title"></div>
						<div class="right">
							<a class="link replay">
								<i class="icon material-icons md-only">replay</i>
								<span class="if-not-md"></span>
							</a>
						</div>
					</div>
				</div>
				<div class="page">
					<div class="page-content login-screen-content iframe"></div>
				</div>
			</div>
		</div>
		<div id="live" class="login-screen">
			<div class="view">
				<div class="navbar">
					<div class="navbar-bg"></div>
					<div class="navbar-inner sliding">
						<div class="left">
							<a class="link back">
								<i class="icon icon-back"></i>
								<span class="if-not-md"></span>
							</a>
						</div>
						<div class="title">W O O H O&nbsp;&nbsp;&nbsp;L I V E</div>
						<div class="right"> </div>
					</div>
				</div>
				<div class="page">
					<div class="page-content login-screen-content">
						<!-- LIVE VIDEO LINK HERE -->
						<iframe src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fsansan.theresa97%2Fvideos%2F1580079652153962%2F&width=1920" width="889" height="500" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true" allowFullScreen="true"></iframe>
					</div>
				</div>
			</div>
		</div>
		<div id="pnw" class="login-screen">
			<div class="view">
				<div class="navbar">
					<div class="navbar-bg"></div>
					<div class="navbar-inner sliding">
						<div class="left"> </div>
						<div class="title">5:00</div>
						<div class="right"> </div>
					</div>
				</div>
				<div class="page">
					<div class="page-content login-screen-content">
						
					</div>
				</div>
			</div>
		</div>
		<div id="ptc" class="login-screen">
			<div class="view">
				<div class="navbar">
					<div class="navbar-bg"></div>
					<div class="navbar-inner sliding">
						<div class="left">
							<a class="link back">
								<i class="icon icon-back"></i>
								<span class="if-not-md"></span>
							</a>
						</div>
						<div class="title translate" data-en="Practice" data-bm="Latihan" data-cn="练习" data-tm="பயிற்சி">Practice</div>
						<div class="right"> </div>
					</div>
				</div>
				<div class="page">
					<div class="page-content login-screen-content">
						<div class="list media-list inset">
							<ul>
								<li>
									<a class="item-link item-content btn-ptc-tzf">
										<div class="item-media"><img src="img/2048.gif" width="80"/></div>
										<div class="item-inner">
											<div class="item-title-row">
												<div class="item-title">2048</div>
											</div>
										</div>
									</a>
								</li>
								<li>
									<a class="item-link item-content btn-ptc-fpb">
										<div class="item-media"><img src="img/flappy.gif" width="80"/></div>
										<div class="item-inner">
											<div class="item-title-row">
												<div class="item-title">Flappy Bird</div>
											</div>
										</div>
									</a>
								</li>
								<li>
									<a class="item-link item-content btn-ptc-pcm">
										<div class="item-media"><img src="img/pacman.gif" width="80"/></div>
										<div class="item-inner">
											<div class="item-title-row">
												<div class="item-title">Pac Man</div>
											</div>
										</div>
									</a>
								</li>
								<li>
									<a class="item-link item-content btn-ptc-pbb">
										<div class="item-media"><img src="img/bobble.gif" width="80"/></div>
										<div class="item-inner">
											<div class="item-title-row">
												<div class="item-title">Puzzle Bobble</div>
											</div>
										</div>
									</a>
								</li>
								<li>
									<a class="item-link item-content btn-ptc-sdk">
										<div class="item-media"><img src="img/sudoku.gif" width="80"/></div>
										<div class="item-inner">
											<div class="item-title-row">
												<div class="item-title">Sudoku</div>
											</div>
										</div>
									</a>
								</li>
								<li>
									<a class="item-link item-content btn-ptc-trr">
										<div class="item-media"><img src="img/trex.gif" width="80"/></div>
										<div class="item-inner">
											<div class="item-title-row">
												<div class="item-title">T-Rex Runner</div>
											</div>
										</div>
									</a>
								</li>
								<li>
									<a class="item-link item-content btn-ptc-tts">
										<div class="item-media"><img src="img/tetris.gif" width="80"/></div>
										<div class="item-inner">
											<div class="item-title-row">
												<div class="item-title">Tetris</div>
											</div>
										</div>
									</a>
								</li>
								<li>
									<a class="item-link item-content btn-ptc-tdt">
										<div class="item-media"><img src="img/twodots.gif" width="80"/></div>
										<div class="item-inner">
											<div class="item-title-row">
												<div class="item-title">Two Dots</div>
											</div>
										</div>
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div id="ldb" class="login-screen">
			<div class="view">
				<div class="navbar">
					<div class="navbar-bg"></div>
					<div class="navbar-inner sliding">
						<div class="left">
							<a class="link back">
								<i class="icon icon-back"></i>
								<span class="if-not-md"></span>
							</a>
						</div>
						<div class="title translate" data-en="Leaderboard" data-bm="Senarai Juara" data-cn="排行榜" data-tm="சாம்பியன் பட்டியல்">Leaderboard</div>
						<div class="right"> </div>
					</div>
				</div>
				<div class="page">
					<div class="page-content login-screen-content">
						<div class="list media-list inset">
							<ul>
								<li>
									<a class="item-link item-content btn-ldb-tzf" data-game="2048">
										<div class="item-inner">
											<div class="item-title-row">
												<div class="item-title">2048</div>
											</div>
										</div>
									</a>
								</li>
								<li>
									<a class="item-link item-content btn-ldb-fpb" data-game="flappy">
										<div class="item-inner">
											<div class="item-title-row">
												<div class="item-title">Flappy Bird</div>
											</div>
										</div>
									</a>
								</li>
								<li>
									<a class="item-link item-content btn-ldb-mro" data-game="mario">
										<div class="item-inner">
											<div class="item-title-row">
												<div class="item-title">Mario</div>
											</div>
										</div>
									</a>
								</li>
								<li>
									<a class="item-link item-content btn-ldb-pcm" data-game="pacman">
										<div class="item-inner">
											<div class="item-title-row">
												<div class="item-title">Pac Man</div>
											</div>
										</div>
									</a>
								</li>
								<li>
									<a class="item-link item-content btn-ldb-pbb" data-game="bobble">
										<div class="item-inner">
											<div class="item-title-row">
												<div class="item-title">Puzzle Bobble</div>
											</div>
										</div>
									</a>
								</li>
								<li>
									<a class="item-link item-content btn-ldb-sdk" data-game="sudoku">
										<div class="item-inner">
											<div class="item-title-row">
												<div class="item-title">Sudoku</div>
											</div>
										</div>
									</a>
								</li>
								<li>
									<a class="item-link item-content btn-ldb-trr" data-game="trexrunner">
										<div class="item-inner">
											<div class="item-title-row">
												<div class="item-title">T-Rex Runner</div>
											</div>
										</div>
									</a>
								</li>
								<li>
									<a class="item-link item-content btn-ldb-tts" data-game="tetris">
										<div class="item-inner">
											<div class="item-title-row">
												<div class="item-title">Tetris</div>
											</div>
										</div>
									</a>
								</li>
								<li>
									<a class="item-link item-content btn-ldb-tdt" data-game="twodots">
										<div class="item-inner">
											<div class="item-title-row">
												<div class="item-title">Two Dots</div>
											</div>
										</div>
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div id="stg" class="login-screen">
			<div class="view">
				<div class="navbar">
					<div class="navbar-bg"></div>
					<div class="navbar-inner sliding">
						<div class="left">
							<a class="link back">
								<i class="icon icon-back"></i>
								<span class="if-not-md"></span>
							</a>
						</div>
						<div class="title translate" data-en="Settings" data-bm="Konfigurasi" data-cn="设定" data-tm="அமைப்புகள்">Settings</div>
						<div class="right"> </div>
					</div>
				</div>
				<div class="page">
					<div class="page-content login-screen-content">
						<div class="list">
							<ul>
								<li>
									<a class="item-link item-content btn-stc-usn">
										<div class="item-media">
											<i class="icon material-icons md-only">assignment_ind</i>
										</div>
										<div class="item-inner">
											<div class="item-title translate" data-en="Username" data-bm="Nama Pengguna" data-cn="用户名" data-tm="பயனர்பெயர்">Username</div>
											<div class="item-after">Guest</div>
										</div>
									</a>
								</li>
								<li>
									<a class="item-link item-content btn-stc-stt">
										<div class="item-media">
											<i class="icon material-icons md-only">location_on</i>
										</div>
										<div class="item-inner">
											<div class="item-title translate" data-en="State / Province" data-bm="Negeri" data-cn="州属" data-tm="மாநில மாகாணம்">State / Province</div>
											<div class="item-after"><img class="state" src="img/state/kualalumpur.png" width="36" height="36"/></div>
										</div>
									</a>
								</li>
								<li>
									<a class="item-link item-content btn-stc-fsc">
										<div class="item-media">
											<i class="icon material-icons md-only">fullscreen</i>
										</div>
										<div class="item-inner">
											<div class="item-title translate" data-en="Fullscreen" data-bm="Mod Skrin Penuh" data-cn="全屏" data-tm="முழு திரை">Fullscreen</div>
											<div class="item-after translate_on_off" data-en-on="ON" data-bm-on="BUKA" data-cn-on="开" data-tm-on="திறந்த" data-en-off="OFF" data-bm-off="TUTUP" data-cn-off="关" data-tm-off="தநெருக்கமான">ON</div>
										</div>
									</a>
								</li>
								<li>
									<a class="item-link item-content btn-stc-lgg">
										<div class="item-media">
											<i class="icon material-icons md-only">translate</i>
										</div>
										<div class="item-inner">
											<div class="item-title translate" data-en="Language" data-bm="Bahasa" data-cn="语言" data-tm="மொழி">Language</div>
											<div class="item-after translate" data-en="English" data-bm="Bahasa Malaysia" data-cn="中文" data-tm="தமிழ்">English</div>
										</div>
									</a>
								</li>
								<li>
									<a class="item-link item-content btn-stc-snd">
										<div class="item-media">
											<i class="icon material-icons md-only">volume_up</i>
										</div>
										<div class="item-inner">
											<div class="item-title translate" data-en="Sound" data-bm="Bunyi" data-cn="声音" data-tm="ஒலி">Sound</div>
											<div class="item-after translate_on_off" data-en-on="ON" data-bm-on="BUKA" data-cn-on="开" data-tm-on="திறந்த" data-en-off="OFF" data-bm-off="TUTUP" data-cn-off="关" data-tm-off="தநெருக்கமான">ON</div>
										</div>
									</a>
								</li>
								<li>
									<a class="item-link item-content btn-stc-rst">
										<div class="item-media">
											<i class="icon material-icons md-only">phonelink_erase</i>
										</div>
										<div class="item-inner">
											<div class="item-title">Reset</div>
										</div>
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="views">
			<div class="view view-main">
				<div class="navbar">
					<div class="navbar-bg"></div>
					<div class="navbar-inner sliding">
						<div class="left"> </div>
						<div class="title">W O O H O</div>
						<div class="right"> </div>
					</div>
				</div>
				<div class="page">
					<div class="card" style="margin-top:50px;">
						<div class="card-header">
							<p class="row">
								<img src="icon.png" height="128" width="128">
							</p>
						</div>
						<div class="card-content card-content-padding">
							<p class="row">
								<button class="col button button-fill button-raised btn-wlv translate" data-en="Watch Live" data-bm="Video Secara Langsung" data-cn="看直播" data-tm="நேரடி வீடியோ">Watch Live</button>
							</p>
							<p class="row">
								<button class="col button button-fill button-raised btn-pnw translate" data-en="Play and Win" data-bm="Main dan Menang" data-cn="玩游戏赢奖" data-tm="விளையாடு மற்றும் வெற்றி">Play and Win</button>
							</p>
							<p class="row">
								<button class="col button button-fill button-raised btn-ptc translate" data-en="Practice" data-bm="Latihan" data-cn="练习" data-tm="பயிற்சி">Practice</button>
							</p>
							<p class="row">
								<button class="col button button-fill button-raised btn-ldb translate" data-en="Leaderboard" data-bm="Senarai Juara" data-cn="排行榜" data-tm="சாம்பியன் பட்டியல்">Leaderboard</button>
							</p>
							<p class="row">
								<button class="col button button-fill button-raised btn-ecn translate" data-en="Earn Coin" data-bm="Dapatkan Coin" data-cn="赚 coin" data-tm="Coin சம்பாதி">Earn Coin</button>
							</p>
							<p class="row">
								<button class="col button button-fill button-raised btn-stg translate" data-en="Settings" data-bm="Konfigurasi" data-cn="设定" data-tm="அமைப்புகள்">Settings</button>
							</p>
							<p class="row">
								<button class="col button button-fill button-raised btn-hlp translate" data-en="Help" data-bm="Maklumat" data-cn="帮助" data-tm="தகவல்">Help</button>
							</p>
						</div>
						<div class="card-footer" style="height:330px;">
							
						</div>
						<div id="wooho-coin" class="fab fab-extended fab-right-top color-gray" style="margin: 15px 15px 0 0;">
							<a href="#">
								<i class="icon material-icons md-only">monetization_on</i>
								<div class="fab-text">0</div>
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<script src="framework7/js/framework7.min.js"></script>
	<script src="js/jquery-3.4.1.min.js"></script>
	<script src="js/md5.min.js"></script>
	<script src="js/app.js"></script>
	<script type="text/javascript">
		app.initialize();
		
		var PNWinterval, PNWtimer = 300;
		
		function PNW(){
			PNWtimer = 300;
			
			var DATA = JSON.parse(STORAGE.getItem('data'));
			
			apps.dialog.close();
			apps.loginScreen.open($('#pnw'), true);
			if(DATA.configuration.fullscreen){
				document.documentElement.requestFullscreen();
			}
			
			$('#pnw .login-screen-content iframe').remove();
			// CHANGE HERE [link][width][height]
			$('#pnw .login-screen-content').append('<iframe id="pnw_game" src="games/bobble/index.html" scrolling="no" width="500" height="800" allowfullscreen="true" onload="PNWonLoad()"></iframe>');
			// CHANGE HERE [color]
			$('#pnw .login-screen-content').css('background-color', '#444444');
			
			PNWinterval = window.setInterval(function(){
				PNWtimer--;
				
				if(PNWtimer==0){
					// CHANGE HERE [score]
					var gameScore = parseInt($('#score span', $('#pnw .login-screen-content iframe').contents()).text());
						
					gameScore = (isNaN(gameScore) ? 0 : gameScore);
					
					var DATA = JSON.parse(STORAGE.getItem('data'));
					
					//CHANGE HERE [game name]
					ajaxData = {
						'usr' : DATA.profile.username,
						'state' : DATA.profile.state,
						'game' : 'bobble',
						'score' : gameScore,
						'coupon' : $('#pnw').data('coupon')
					};
					postAjaxData = "ACT=" + encodeURIComponent('pnw_score')
								 + "&DATA=" + encodeURIComponent(sys.serialize(ajaxData));
							  
					$.ajax({
						type: 'POST',
						url: 'http://wooho.fun/',
						data: postAjaxData,
						success: function(str){
							apps.loginScreen.close($('#pnw'), true);
							apps.dialog.alert(('Congratulations, your score is ' + gameScore), '');
							$('#pnw').removeData('coupon');
						}
					});
				}else{
					var m = Math.floor(PNWtimer/60), s = PNWtimer%60;
					var sPad = ((s < 10) ? ('0' + s) : ('' + s));
					
					$('#pnw').find('.view .title').text((m + ':' + sPad));
					
					if(PNWtimer % 5 == 0){
						// CHANGE HERE [score]
						var gameScore = parseInt($('#score span', $('#pnw .login-screen-content iframe').contents()).text());
						
						gameScore = (isNaN(gameScore) ? 0 : gameScore);
						
						var DATA = JSON.parse(STORAGE.getItem('data'));
						
						//CHANGE HERE [game name]
						ajaxData = {
							'usr' : DATA.profile.username,
							'state' : DATA.profile.state,
							'game' : 'bobble',
							'score' : gameScore,
							'coupon' : $('#pnw').data('coupon')
						};
						postAjaxData = "ACT=" + encodeURIComponent('pnw_score')
									 + "&DATA=" + encodeURIComponent(sys.serialize(ajaxData));
								  
						$.ajax({
							type: 'POST',
							url: 'http://wooho.fun/',
							data: postAjaxData,
							success: function(str){
								console.log(str);
							}
						});
					}
				}
			}, 1000);
		}
		
		function PNWonLoad(){
			var w = window.innerWidth,
				h = window.innerHeight;
			var sizeW = (w/500),
				sizeH = (h/(800+56));
				
			if(sizeW < sizeH){
				$('#pnw iframe').css('transform', 'scale(' + sizeW + ')');
				$('#pnw iframe').css('top', ((((sizeW*800)-800)/2)+56+'px'));
				$('#pnw iframe').css('left', ((((sizeW*500)-500)/2)+'px'));
			}else{
				$('#pnw iframe').css('transform', 'scale(' + sizeH + ')');
				$('#pnw iframe').css('top', ((((sizeH*800)-800)/2)+56+'px'));
				$('#pnw iframe').css('left', ((((sizeH*500)-500)/2)+'px'));
			}
		}
	</script>
</body>
</html>

<?php
		// }else{
?>

<html><body>aaaaaaaa</body></html>

<?php
		// }
	}
?>