const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

ctx.fillStyle = 'black';
ctx.fillRect(0, 0, 128, 32);

//http://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?limit=300&groups=50

var gameData;

//async function getData() {
//	
//	let response = await fetch('//http://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?limit=300&groups=50');
//	gameData = await response.json();
//	return gameData;
//}

//============================General Purpose Functions ========================================//

function drawTeamOne (teamId, score) {
	var img = new Image();
	img.src = `./img/${teamId}.png`;
	img.onload = function() {
		ctx.drawImage(img,0,0);
		
	}
	
	ctx.font = '19px Pixelade';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillStyle = '#fff';
	ctx.fillText(score, 50, 10);
	
}


function drawTeamTwo (teamId, score) {
	var img = new Image();
	img.src = `./img/${teamId}.png`;
	img.onload = function() {
		ctx.drawImage(img,92,0);
		
	}
	
	ctx.font = '19px Pixelade';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillStyle = '#fff';
	ctx.fillText(score, 78, 10);
	
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

var gameID = 0;
var reloadTime = 24 * 5000;

//============================General Purpose Functions ========================================//

async function displayresults() {
	
	await fetch('http://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?limit=300&groups=50')
	  .then(response => response.json())
	  .then(data => gameData = data);
	console.log(gameData);

	let numberOfGames = gameData.events.length;
	console.log(numberOfGames)
	
		
	function cycleGameNum() {
			//Cycle through the games  
			  if (gameID == (numberOfGames - 1)) {
				  gameID = 0;
			  } else {
				  gameID++;
			  }
		updateGame(gameID);
	}
	
	cycleGameNum();
	setInterval(cycleGameNum,5000);

	
	if (numberOfGames > 24) {
		let reloadTime = numberOfGames * 5000;
	} else {
		let reloadTime = 5000 * 24;
	}	
	
}

displayresults();
setInterval(displayresults, reloadTime);


