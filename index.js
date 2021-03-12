const fs = require('fs');
//const request = require('request');
const fetch = require('node-fetch');
const { createCanvas, loadImage } = require('canvas');
const PixelPusher = require('node-pixel-pusher')
const service = new PixelPusher.Service()

service.on('discover', (device) => {
  createRenderer(device)
})


const nodeCanvas = require('canvas')

const MAX_FPS = 30




//const canvas = document.getElementById('canvas');
//const ctx = canvas.getContext('2d');
//
//ctx.fillStyle = 'black';
//ctx.fillRect(0, 0, 128, 32);

//http://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?limit=300&groups=50

var gameData;

var i=0;
var maxGames;



function createRenderer(device) {
  const width = device.deviceData.pixelsPerStrip
  const height = device.deviceData.numberStrips
  const canvas = nodeCanvas.createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  console.log(`Creating renderer ${width}x${height} ${MAX_FPS}fps`)

  device.startRendering(() => {
				//============================General Purpose Functions ========================================//
	  			ctx.quality ='best';
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

				}

				//============================ Set Starting Defaults ========================================//

//				var gameID = 0;
				var reloadTime = 24 * 5000;

				//============================General Purpose Functions ========================================//

				async function displayresults() {
					await fetch('http://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?limit=300&groups=50')
					  .then(response => response.json())
					  .then(data => {gameData = data
									console.log("JT Sucks asshole")});
//					console.log(gameData);

					let numberOfGames = gameData.events.length;
					maxGames = numberOfGames;
//					console.log(numberOfGames)

					
				
					
					updateGame(i);

					if (numberOfGames > 24) {
						reloadTime = numberOfGames * 5000;
					} else {
						reloadTime = 5000 * 24;
					}	

				}
	  
	  
  
	  				
	  

				displayresults();
				setInterval(displayresults, reloadTime);


	// Get data
	const ImageData = ctx.getImageData(0, 0, width, height)
    // Send data to LEDs
    device.setRGBABuffer(ImageData.data)
  }, MAX_FPS)



}


					(function startIncrement() {
												var timer;
												function increement() {
												 if(i<maxGames-1) {
												  i++;
												  console.log( 'Currently at ' + i )
													 console.log(maxGames)
												 } else {
												  i=0;
												 }
												}

												setInterval(increement, 5000);		
					})()	












