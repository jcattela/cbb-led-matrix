const fs = require('fs');
const fetch = require('node-fetch');
const { createCanvas, loadImage } = require('canvas');
const PixelPusher = require('node-pixel-pusher')
const service = new PixelPusher.Service()

service.on('discover', (device) => {
  createRenderer(device)
})

const nodeCanvas = require('canvas')

const MAX_FPS = 30

const canvas = nodeCanvas.createCanvas(128, 32)
const ctx = canvas.getContext('2d')
ctx.quality ='best';

//============================ Globals to Overwrite ========================================//

var gameData;
var currentGame=0;
var maxGames;
var reloadTime = 24 * 5000;

//============================ Functions To Draw Canvas ========================================//

function drawTeamOne (teamId, score) {

	loadImage(`./img/${teamId}-processed.bmp`).then(image => {
	  ctx.drawImage(image, 0,0)
	})					


	ctx.font = '22px Pixelade';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillStyle = '#fff';
	ctx.fillText(score, 50, 8);

}


function drawTeamTwo (teamId, score) {

	loadImage(`./img/${teamId}-processed.bmp`).then(image => {
	  ctx.drawImage(image, 92,0)
	})
	ctx.font = '22px Pixelade';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillStyle = '#fff';
	ctx.fillText(score, 78, 8);

}


function drawGameStatus (gameState, status, gamedate, gamePPd) {

//Text options	

	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillStyle = '#fff';

//Format date if not Active
	let gameTime = new Date(gamedate);

	let timeOptions = {hour: 'numeric', minute: '2-digit', hour12: true};

	let testGameTime = gameTime.toLocaleTimeString([], timeOptions);

	let dateOptions = {weekday: 'short'};
	let testGameDate = gameTime.toLocaleDateString([], dateOptions);	

	if (gameState == 'pre'){
		ctx.fillStyle = 'black';
		ctx.fillRect(36,0,56,32);
		ctx.fillStyle = '#fff';
		ctx.font = '19px Pixelade';
		ctx.fillText(testGameDate.toUpperCase(), 64, 9);
		ctx.font = '17px Pixelade';
		ctx.fillText(testGameTime.toUpperCase(), 64, 24);				

	} else if(gameState == 'post' && gamePPd != 'STATUS_FINAL') {
		ctx.fillStyle = 'black';
		ctx.fillRect(36,0,56,32);
		ctx.fillStyle = '#fff';
		ctx.font = '19px Pixelade';
		ctx.fillText('CNCLD', 64, 9);

	} else {
		  if (status.length > 8) {
			  ctx.font = '14px Pixelade';

		  } else {
			  ctx.font = '16px Pixelade';
		  }			

		ctx.fillText(status.toUpperCase(), 64, 24);
	}	

}

function updateGame(gameNum) {

	let teamOneId = gameData.events[gameNum].competitions[0].competitors[1].team.id;
	let teamTwoId = gameData.events[gameNum].competitions[0].competitors[0].team.id;
	let teamOneScore = gameData.events[gameNum].competitions[0].competitors[1].score;
	let teamTwoScore = gameData.events[gameNum].competitions[0].competitors[0].score;
	let gameStatus = gameData.events[gameNum].competitions[0].status.type.shortDetail;
	let gameStatusConc = gameStatus.replace(" - ", " ").replace("/", " ");

	let gameState = gameData.events[gameNum].competitions[0].status.type.state;
	let gameDate = gameData.events[gameNum].competitions[0].date;
	let gamePPd = gameData.events[gameNum].status.type.name;

	ctx.clearRect(0,0,126,32);
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, 128, 32);

	drawTeamOne(teamOneId, teamOneScore);
	drawTeamTwo(teamTwoId, teamTwoScore);
	drawGameStatus(gameState, gameStatusConc, gameDate, gamePPd);
	return ctx;

}

//============================ Function to Fetch JSON data ========================================//

async function displayresults() {
	await fetch('http://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?limit=300&groups=100')
	  .then(response => response.json())
	  .then(data => {gameData = data});

	let numberOfGames = gameData.events.length;
	maxGames = numberOfGames;


	if (numberOfGames > 24) {
		reloadTime = numberOfGames * 5000;
	} else {
		reloadTime = 5000 * 24;
	}	

}

displayresults();
setInterval(displayresults, reloadTime);

//============================ Render to LED Matrix with Pixel Push ========================================//

function createRenderer(device) {

  console.log(`Creating renderer 128x32 ${MAX_FPS}fps`)

  device.startRendering(() => {
				
	// Get data
	let ImageData = ctx.getImageData(0, 0, 128, 32)
    // Send data to LEDs
    device.setRGBABuffer(ImageData.data)
  }, MAX_FPS)

}

//============================ Increment game every 5 Seconds ========================================//

(function startIncrement() {
		var timer;
		function increment() {
		 if(currentGame<maxGames-1) {
		  currentGame++;
		 } else {
		  currentGame=0;
		 }
			updateGame(currentGame);
		}

		setInterval(increment, 5000);		
})()	












