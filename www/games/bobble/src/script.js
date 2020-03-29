// Puzzle Bobble Remake

setBackdropColor("#444");

// holds the colors of the bubbles
var colors = ["#475E6C", "#54BDA8", "#EFC94C", "#E27A3F", "#EF5A49"];

// create the main structural elements

// frame for main game window
var frame = new Rectangle({
	color: "#222",
	height: 560,
	width: 470,
	y: -30
});
// the area that holds the bubbles
var screen = new Rectangle({
	color: "#262626",
	height: 540,
	width: 450,
	y: -30
});
// frame around the timer bar
var timerBarFrame = new Rectangle({
	color: "#222",
	width: 470,
	height: 50,
	y: 285
});
// timer bar
var timerBar = new Rectangle({
	height: 42,
	width: 2,
	color: colors[1],
	y: 285,
	x: -230
});
// bottom of "screen" - displays "next bubble"
var base = new Rectangle({
	color: "#222",
	width: 450,
	height: 75,
	y: -263
});
// "next bubble" text
var upNext = new Text({
	text: "Next bubble:",
	color: "#BBB",
	size: 15,
	y: -260,
	x: -180
});
// shooter arrow
var arrow = new Image({
	url: "./images/arrow.png",
	width: 95,
	height: 35,
	angle: 90,
	y: -230
});

// text box to display game over
var gameOverContainer = new Rectangle({
	brightness: 50,
	color: "white",
	height: 150,
	width: 300,
	y: -30,
	showing: false
});
var gameOverText = new Text({
	text: "Game Over",
	size: 42,
	showing: false
});
var pressEnter = new Text({
	text: "Press enter to play again",
	y: -50,
	size: 24,
	showing: false
});

// arrays to hold the acceptable positions of bubbles
var ys = [212, 164, 116, 68, 20, -28, -76, -124, -172, -220];
var xs = [
	[-193, -138, -83, -28, 27, 82, 137, 192],
	[-165, -110, -55, 0, 55, 110, 165]
];

// initialize some variables
var bubbles;
var bubbleX;
var bubbleY;
var playerBubble;
var nextBubble;
var topRowEight;
var frozen;
var gameOver = false;
var shooting = false;

initialize();

// left and right to move; can't move too far in either direction
forever(() => {
	if (!frozen) {
		if (keysDown.includes('left'))
			arrow.turnLeft(2);
		if (keysDown.includes('right'))
			arrow.turnRight(2);
		if (arrow.angle >= 175)
			arrow.angle = 174;
		if (arrow.angle <= 5)
			arrow.angle = 6;
	} 
});

// shooting with space key
onKeyDown(() => {
	if (keysDown.includes('space') && !shooting && !frozen) {
		shooting = true;
		playerBubble.angle = arrow.angle;
		var touching = false;
		repeatUntil(() => touching, () => {
			// move the bubble
			playerBubble.move(10);

			// bounce off the walls
			if (playerBubble.x > 220) {
				playerBubble.x = 190;
				playerBubble.angle = 180 - playerBubble.angle;
			}
			if (playerBubble.x < -220) {
				playerBubble.x = -190;
				playerBubble.angle = 180 - playerBubble.angle;
			}

			// stop at the top
			if (playerBubble.y >= 212)
				touching = true;

			// check if touching an existing bubble and stop there
			bubbles.forEach(bubble => {
				if (bubble.distanceTo(playerBubble) < 57) {
					touching = true;
					findTouchingBubbles(playerBubble, bubbles);
				}
			});
		}, 
		// callback function that runs after the bubble makes contact and stops
		() => {

			// line up playerBubble on the y axis
			playerBubble.y = closestCoordinate(ys, playerBubble.y);
			
			// line up the playerBubble on the x axis, which depends on if the top row has 7 or 8 bubbles
			// if the top row has eight bubbles
			if (topRowEight) {
				if (ys.indexOf(playerBubble.y) % 2)
					playerBubble.x = closestCoordinate(xs[1], playerBubble.x);
				else
					playerBubble.x = closestCoordinate(xs[0], playerBubble.x);
			}
			
			// if the top row has seven bubbles
			else {
				if (ys.indexOf(playerBubble.y) % 2)
					playerBubble.x = closestCoordinate(xs[0], playerBubble.x);
				else
					playerBubble.x = closestCoordinate(xs[1], playerBubble.x);
			}

			// add this bubble to the list of bubbles
			bubbles.push(playerBubble);

			// identify all bubbles of this color and find matches that are touching the bubble
			var sameColorBubbles = bubbles.filter(bubble => {
				return bubble.color == playerBubble.color && bubble != playerBubble;
			});
			findMatchingBubbles(playerBubble, sameColorBubbles);
			var matches = bubbles.filter(bubble => { return bubble.match; });

			// if there are more than 2 same color bubbles touching, get rid of them
			if (matches.length > 2) {
				matches.forEach(bubble => {
					bubbles.splice(bubbles.indexOf(bubble), 1);
					pop(bubble);
				});
			} 
			// if not, then unmark the matches
			else matches.forEach(bubble => { bubble.match = false; });

			// load the next bubble into the shooter
			playerBubble = nextBubble;
			playerBubble.x = arrow.x;
			playerBubble.y = arrow.y;

			// make the next bubble on deck
			nextBubble = new Circle({
				x: -100,
				y: -263,
				radius: 28,
				color: colors[random(0, 4)]
			});
			nextBubble.touchingBubbles = [];
			shooting = false;
		});
	}
});

// timer bar functionality
every(0.2, 'second', () => {
	// only move if the game isn't frozen (aka game over)
	if (!frozen) {
		timerBar.width += 2;
		timerBar.x += 1;

		// when the bar fills up, start it over, and make a new row of bubbles
		if (timerBar.width >= 462) {
			timerBar.width = 2;
			timerBar.x = -230;
			// drop the existing bubbles down
			bubbles.forEach(bubble => { bubble.y -= 48; });
			// add the appropriate top row
			if (!topRowEight) {
				bubbleX = -193;
				for (let i = 0; i < 8; i++) {
					bubbles.push(new Circle({
						x: bubbleX,
						y: 212,
						radius: 28,
						color: colors[random(0, 4)]
					}));
					bubbleX += 55;
				}
			}
			else {
				bubbleX = -165
				for (let j = 0; j < 7; j++) {
					bubbles.push(new Circle({
						x: bubbleX,
						y: 212,
						radius: 28,
						color: colors[random(0, 4)]
					}));
					bubbleX += 55;
				}
			}
			topRowEight = !topRowEight;
		} 
	}
});

// losing and winning
forever(() => {
	bubbles.forEach(bubble => {
		// you lose if the bubbles get too low
		if (bubble.y < arrow.y + 28 && !frozen) {
			gameOverContainer.sendToFront();
			gameOverContainer.show();
			gameOverText.sendToFront();
			gameOverText.text = "Game Over";
			gameOverText.show();
			pressEnter.sendToFront();
			pressEnter.show();
			gameOver = true;
			frozen = true;
		}
	});
	// you win if you get rid of all the bubbles on the screen
	if (bubbles.length === 0 && !frozen) {
		gameOver = true;
		frozen = true;
		after(1, 'second', () => {
			gameOverContainer.sendToFront();
			gameOverContainer.show();
			gameOverText.sendToFront();
			gameOverText.text = "You Win";
			gameOverText.show();
			pressEnter.sendToFront();
			pressEnter.show();
		});
	}
});

// restart the game when you press enter
onKeyDown(() => {
	if (keysDown.includes('enter') && gameOver) {
		gameOver = false;
		playerBubble.delete();
		nextBubble.delete();
		bubbles.forEach(bubble => { bubble.delete(); });
		initialize();
		gameOverContainer.hide();
		gameOverText.hide();
		pressEnter.hide();
		frozen = false;
	}
});

// functions

// intializes the game at the beginning and when pressing ENTER at the end
function initialize() {
	frozen = false;
	// initialize array for bubbles, and set x and y of the first bubble
	bubbles = [];
	bubbleX = -193;
	bubbleY = 212;
	// create the starting rows of bubbles
	for (let j = 0; j < 4; j++) {
		// alternate rows of 8 and 7 bubbles
		if (bubbleX === -193) {
			for (let i = 0; i < 8; i++) {
				bubbles.push(new Circle({
					x: bubbleX,
					y: bubbleY,
					radius: 28,
					color: colors[random(0, 4)]
				}));
				bubbleX += 55;
			}
		}
		if (bubbleX === -165) {
			for (let k = 0; k < 7; k++) {
				bubbles.push(new Circle({
					x: bubbleX,
					y: bubbleY,
					radius: 28,
					color: colors[random(0, 4)]
				}));
				bubbleX += 55;
			}
		}
		bubbleY -= 48
		if (bubbleX === 247)
			bubbleX = -165;
		else
			bubbleX = -193;
	}
	// create the bubble for the player to shoot
	playerBubble = new Circle({
		x: 0,
		y: -230,
		radius: 28,
		color: colors[random(0, 4)]
	});
	// it's not touching any bubbles yet, so initialize an empty array
	playerBubble.touchingBubbles = [];
	
	// create the bubble that's up next
	nextBubble = new Circle({
		x: -100,
		y: -263,
		radius: 28,
		color: colors[random(0, 4)]
	});
	nextBubble.touchingBubbles = [];
	
	// let each bubble on the screen identify which bubbles it is touching
	bubbles.forEach(bubble => { findTouchingBubbles(bubble, bubbles) });
	
	topRowEight = true;
	timerBar.width = 2;
	timerBar.x = -230;
}

// makes disconnected bubbles fall
function dropDisconnectedBubbles() {
	// reset the touching bubbles and connected properties of all bubbles
	bubbles.forEach(bubble => {
		findTouchingBubbles(bubble, bubbles);
		bubble.connected = false;
	});
	playerBubble.connected = true;
	// identify top bubbles
	var topBubbles = [];
	bubbles.forEach(bubble => {
		if (bubble.y === 212) {
			bubble.top = true;
			bubble.connected = true;
			topBubbles.push(bubble);
		} else {
			bubble.top = false;
		}
	});
	// find all the bubbles that are connected to the top, and deal with the ones that aren't
	topBubbles.forEach(markAllConnected);
	bubbles.forEach(bubble => {
		if (!bubble.connected) {
			bubbles.splice(bubbles.indexOf(bubble), 1);
			fall(bubble);
		}
	});
}

// finds the closest X or Y location to the given location
function closestCoordinate(array, currentCoordinate) {
	return array.reduce((min, cur) => {
		if (Math.abs(cur - currentCoordinate) < Math.abs(min - currentCoordinate))
			return cur;
		return min;
	});
}

// finds all the bubbles in list can chain together to touch sprite
// this is used to decide which bubbles to pop
function findMatchingBubbles(sprite, list) {
	list.forEach(bubble => {
		if (bubble.distanceTo(sprite) < 58 && bubble != sprite && !bubble.match) {
			bubble.match = true;
			sprite.match = true;
			findMatchingBubbles(bubble, list);
		}
	});
}

// identifies all the bubbles in list that are touching sprite
function findTouchingBubbles(sprite, list) {
	sprite.touchingBubbles = [];
	list.forEach(bubble => {
		if (bubble.distanceTo(sprite) < 58 && bubble != sprite) {
			sprite.touchingBubbles.push(bubble);
		}
	});
}

// finds out if a given bubble is connected to the top (if it isn't then it should fall)
function isConnected(sprite) {
	if (sprite.top)
		return true;
	sprite.touchingBubbles.forEach(isConnected);
}

// marks all bubbles that are connected to the top
function markAllConnected(topBubble) {
	topBubble.touchingBubbles.forEach(bubble => {
		if (!bubble.connected) {
			bubble.connected = true;
			markAllConnected(bubble);
		}
	});
}

// animate the bubble falling
function fall(bubble) {
	var speed = 3;
	repeatUntil(() => bubble.y < arrow.y + 20, () => {
		bubble.y -= speed;
		speed *= 1.12;
	}, 
	// callback function to pop the bubble once it's hit the bottom
	() => { pop(bubble); });
}

// animate the bubble popping
function pop(bubble) {
	// first it grows a little
	repeat(7, () => {
		bubble.radius += 1;
	}, () => {
		// then it shrinks quickly
		repeat(3, () => {
			bubble.radius -= 7;
		}, () => {
			// then it triggers any bubbles to drop if necessary
			if (bubble.y > arrow.y + 20) {
				dropDisconnectedBubbles();
			}
			bubble.delete();
		});
	});
}
