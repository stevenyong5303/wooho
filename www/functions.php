<?php
	date_default_timezone_set("Asia/Kuala_Lumpur");

	$HOST = 'localhost';
	$USER = 'reeondpo_wh';
	$PASS = '$;(*7w%MS;q%';
	$DATB = 'reeondpo_wooho';
	
	$mysqli = new mysqli($HOST, $USER, $PASS, $DATB);
	
	if($mysqli->connect_errno){
		echo "Failed to connect to database: " . $mysqli->connect_error;
	}
	$mysqli->set_charset("utf8");

	function addQuotes($val){
		return '"'.addslashes($val).'"';
	}
	
	function saparateGame($val){
		$result = [
			'2048' => [],
			'bobble' => [],
			'flappy' => [],
			'mario' => [],
			'pacman' => [],
			'sudoku' => [],
			'trexrunner' => [],
			'tetris' => [],
			'twodots' => []
		];
		
		for($i = 0; $i < count($val); $i++){
			switch($val[$i]['game_id']){
				case '2048':
					if(count($result['2048'])<10){
						array_push($result['2048'], $val[$i]);
					}
					break;
				case 'flappy':
					if(count($result['flappy'])<10){
						array_push($result['flappy'], $val[$i]);
					}
					break;
				case 'mario':
					if(count($result['mario'])<10){
						array_push($result['mario'], $val[$i]);
					}
					break;
				case 'pacman':
					if(count($result['pacman'])<10){
						array_push($result['pacman'], $val[$i]);
					}
					break;
				case 'bobble':
					if(count($result['bobble'])<10){
						array_push($result['bobble'], $val[$i]);
					}
					break;
				case 'sudoku':
					if(count($result['sudoku'])<10){
						array_push($result['sudoku'], $val[$i]);
					}
					break;
				case 'trexrunner':
					if(count($result['trexrunner'])<10){
						array_push($result['trexrunner'], $val[$i]);
					}
					break;
				case 'tetris':
					if(count($result['tetris'])<10){
						array_push($result['tetris'], $val[$i]);
					}
					break;
				case 'twodots':
					if(count($result['twodots'])<10){
						array_push($result['twodots'], $val[$i]);
					}
					break;
			}
		}
		
		return $result;
	}
	
?>