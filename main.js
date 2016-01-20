'use strict';

$(document).ready(init);

var ref = new Firebase('https://tic-tac-toe-multi.firebaseio.com/');
var playersRef = ref.child('players');
var gameStateRef = ref.child('gameState');
var turnStateRef = ref.child('turn');
var restartGameFlagRef = ref.child('turn');

var currentPlayerG = '';
var arrayOfSquaresG = [];

function init(){
	// Set up the player
	$('#input-name-submit-button').on('click', getPlayerName);	
	$('.squares').on('click', squareClicked);
	$('#restart-game').on('click', restartGame);
}

function restartGame(){
	if(currentPlayerG !== ''){
		playersRef.remove();
  	gameStateRef.remove();
 		turnStateRef.remove();
	}
}

ref.on('value', function(snap){
	//debugger;
	if(snap.val() === null){
		currentPlayerG = '';
	  arrayOfSquaresG.splice(0, arrayOfSquaresG.length);
	  $('#which-player').text('');
	  $('#player-turn').text('');
	  $('#input-name').val('');
	}
});

ref.child('gameState').on('value', function(snap){
		console.log(snap.val());
    drawBoard(snap);
});

function drawBoard(snap){
		arrayOfSquaresG.splice(0, arrayOfSquaresG.length);
	  $('.main-container').empty();
	  if(snap === null){
	  	debugger;
	  	snap.val() = '';
	  }
  	for(var i = 0; i < 9; i++) {
  		var symbol = '';
  		if(snap.val()[i] == 1){
  			 symbol = 'X';
  		}
  		else if(snap.val()[i] == -1){
  			symbol = 'O';
  		}
  		else {
  			symbol = '';
  		}
  		console.log('symbol:', symbol);
  		
    	var $squaresG = $('<div>').addClass('squares').data('player', snap.val()[i]).text(symbol);//.prop('disabled', false);
    	arrayOfSquaresG.push($squaresG);
    }

    $('.main-container').append(arrayOfSquaresG);
    $('.squares').click(squareClicked);
    checkIfWin();
}

var whoseTurnIsIt='';
// monitor the turn ref
ref.child('turn').on('value', function(snap){
  whoseTurnIsIt = snap.val();
  //debugger;
  if(whoseTurnIsIt !== null){
  	$('#player-turn').text('Whose turn: ' + whoseTurnIsIt);
  }
});	

function squareClicked(){	
	var $this = $(this);
	var index = $(this).index();
  if(whoseTurnIsIt === currentPlayerG){
  	if(currentPlayerG === 'playerX'){
  		$this.text('X');
  		turnStateRef.set('playerO');
  		gameStateRef.once('value', function(snap){
  			console.log(snap.val());
  			var tempArr = snap.val();
  			tempArr.splice(index,1,1);
  			console.log(tempArr);
  			gameStateRef.set(tempArr);
  		});
  	}
  	else {
  		$this.text('O');
  		turnStateRef.set('playerX');
  		gameStateRef.once('value', function(snap){
  			console.log(snap.val());
  			var tempArr = snap.val();
  			tempArr.splice(index,1,-1);
  			console.log(tempArr);
  			gameStateRef.set(tempArr);
  		});
  	}
  }
}

function startGame(){
  // make turn child in firebase, and initialize it to player1;
  ref.child('turn').set('playerX');
  $('#player-turn').text('Whose turn: ' + whoseTurnIsIt);
  
  var board = [0,0,0,0,0,0,0,0,0];
  gameStateRef.set(board);

}

function getPlayerName(){
	console.log('in get player name');
  playersRef.once('value', function(snapshot){
  	debugger;
    console.log(snapshot.val());
    if(!snapshot.val()){
    	debugger;
      playersRef.push({player1: $('#input-name').val()});
      currentPlayerG = 'playerX';
      $('#which-player').text('You are: ' + currentPlayerG);
    }
    else if(Object.keys(snapshot.val()).length===1){
    	debugger;
      playersRef.push({player2: $('#input-name').val()});
      currentPlayerG = 'playerO';
      $('#which-player').text('You are: ' + currentPlayerG);
      startGame();
    }
    else{
      return;
    }
  });
}

function checkIfWin(){
	var sq0 = arrayOfSquaresG[0].data('player');
	var sq1 = arrayOfSquaresG[1].data('player');
	var sq2 = arrayOfSquaresG[2].data('player');
	var sq3 = arrayOfSquaresG[3].data('player');
	var sq4 = arrayOfSquaresG[4].data('player');
	var sq5 = arrayOfSquaresG[5].data('player');
	var sq6 = arrayOfSquaresG[6].data('player');
	var sq7 = arrayOfSquaresG[7].data('player');
	var sq8 = arrayOfSquaresG[8].data('player');
  var win1 = sq0 + sq1 + sq2; 
  var win2 = sq3 + sq4 + sq5; 
  var win3 = sq6 + sq7 + sq8; 
  var win4 = sq0 + sq3 + sq6; 
  var win5 = sq1 + sq4 + sq7; 
  var win6 = sq2 + sq5 + sq8; 
  var win7 = sq2 + sq4 + sq6; 
  var win8 = sq0 + sq4 + sq8; 

	if(win1 === 3 || win1 === -3) {
		winEvent(win1 === 3  ? 1:-1);
		return; 
	}
	else if(win2 === 3 || win2 === -3) {
		winEvent(win2 === 3 ? 1:-1);
		return; 
	}
	else if(win3 === 3 || win3 === -3) {
		winEvent(win3 === 3 ? 1:-1);
		return; 
	} 
	else if(win4 === 3 || win4 === -3) {
		winEvent(win4 === 3 ? 1:-1);
		return; 
	}
	else if(win5 === 3 || win5 === -3) {
		winEvent(win5 === 3 ? 1:-1);
		return; 
	}
	else if(win6 === 3 || win6 === -3) {
		winEvent(win6 === 3 ? 1:-1);
		return; 
	} 
	else if(win7 === 3 || win7 === -3) {
		winEvent(win7 === 3 ? 1:-1);
		return; 
	}
	else if(win8 === 3 || win8 === -3) {
		winEvent(win8 === 3 ? 1:-1);
		return; 
	}
    var squaresFilledCounter = 0; 
    for(var i = 0; i < 9; i++){
    	if(arrayOfSquaresG[i].data('player') === 1 || arrayOfSquaresG[i].data('player') === -1) {
        	squaresFilledCounter++;
    	}
    }
    if(squaresFilledCounter === 9) {
    	alert('Nobody won');
    	restartGame();
    }
}

function winEvent(winner) {
    if(winner === 1){
    	alert('Player X wins!!!');
    	restartGame();
    }
    else {
    	alert('Player O wins!!!');
    	restartGame();
    }
}


