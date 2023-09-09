'use strict';

////////// UTILS FUNCTIONS //////////

const score = document.querySelector('#score');
const typeImgElem = document.querySelectorAll('.img');
const submit = document.querySelector('.submit');
const livesElem = document.querySelector('.lives');

let selected = 0;
let selectedElems = [];

// Count how many types are selected
// Enable/disable the submit button
// Add an outline to the selected types
for (let i = 0; i < typeImgElem.length; i++) {
	typeImgElem[i].addEventListener('click', (event) => {
		const classes = event.target.className;
		const elem = document.querySelector(classes.replaceAll(' ', '.'));
		// console.log(elem.classList.contains('img-lose'));
		if (elem.getAttribute('data-selected') == 'false' && !elem.classList.contains('img-lose')) {
			elem.style.outline = '2px solid hsl(0, 0%, 91%)';
			elem.setAttribute('data-selected', 'true');
			selectedElems.push(elem);
			selected++;
		} else if (!elem.classList.contains('img-lose')) {
			elem.style.outline = 'none';
			elem.setAttribute('data-selected', 'false');
			selectedElems.splice(selectedElems.indexOf(elem), 1);
			selected--;
		}

		selected >= 1 ? submit.removeAttribute('disabled') : submit.setAttribute('disabled', true);
	});
}

function arraysEqual(a, b) {
	if (a === b) return true;
	if (a == null || b == null) return false;
	if (a.length !== b.length) return false;

	a = a.sort();
	b = b.sort();

	for (var i = 0; i < a.length; ++i) {
		if (a[i] !== b[i]) return false;
	}
	return true;
}

///////////// THE REAL GAME ///////////////

let gameMode = 'singleplayer';
let isGameOver = false;
let playerNum = 0;
let ready = false;
let enemyReady = false;
let currentPlayer = 'user';

let correctTypes = [];
let selectedTypes = [];

let multiPlayerTypeParams = [];
let lives;

let page = window.location.href.replace(/(.*)\//, '');

const startButton = document.querySelector('#start');
const infoDisplay = document.querySelector('.info-display');
const turnDisplay = document.querySelector('.turn-display');
const wrapper = document.querySelector('.wrapper');
const connections = document.querySelector('.connections-wrapper');

///////////////////////////////
///////// MULTIPLAYER /////////
//////////////////////////////

// This function listens for new Websocket connections/disconnections and handles the visualization of the connections
// Only 2 people can play a game together. It handles when a third WS-connection wants to join
// It also listens whether both players are ready

function createMultiplayer() {
	gameMode = 'multiplayer';

	const socket = io();

	// Get your player number
	socket.on('player-number', (num) => {
		if (num === -1) {
			infoDisplay.innerHTML = 'Sorry, the server is full';
		} else {
			playerNum = parseInt(num);
			if (playerNum === 1) {
				currentPlayer = 'enemy';
			}

			// Get other player status
			socket.emit('check-players');
		}
	});

	// Another player has connected or disconnected
	socket.on('player-connection', (num) => {
		console.log(`Player number ${num} has connected or disconnected`);
		playerConnectedOrDisconnected(num);
	});

	// On enemy ready
	socket.on('enemy-ready', (num) => {
		enemyReady = true;
		playerReady(num);
		if (ready) playGameMulti(socket);
	});

	// Ready button click
	startButton.addEventListener('click', () => {
		playGameMulti(socket);
	});

	// Check player status
	socket.on('check-players', (players) => {
		players.forEach((p, i) => {
			if (p.connected) playerConnectedOrDisconnected(i);
			if (p.ready) {
				playerReady(i);
				if (i !== playerNum) enemyReady = true;
			}
		});
	});

	// Visualizes if when a second player is connected/disconnected
	function playerConnectedOrDisconnected(num) {
		let player = `.p${parseInt(num) + 1}`;
		document.querySelector(`${player} .connected span`).classList.toggle('green');
		if (parseInt(num === playerNum)) document.querySelector(player).style.fontWeight = 'bold';
	}

	// Listens for a new round
	// socket.once('next-round', (pokemonIdx) => {
	// 	console.log(pokemonIdx);
	// 	// Correct types need to match on both clients
	// 	socket.emit('draw', pokemonIdx);
	// });

	socket.on('correct-types', (pokemonIdx) => {
		notThese.push(pokemonIdx);
		multiPlayerTypeParams = nextRoundMulti(pokemonIdx);
		console.log(multiPlayerTypeParams.allTypes);
		socket.emit('suggested-types', multiPlayerTypeParams);
	});

	socket.on('display-suggested-types', (params) => {
		console.log(params);
		displaySuggestedTypes(params.allTypes);
	});
}

function initMultiplayer(socket) {
	let pokemonIdx = getRandomPokemon(notThese);
	notThese.splice(notThese.indexOf(pokemonIdx), 1);
	socket.emit('next-round', pokemonIdx);
	submit.setAttribute('disabled', true);
	selected = 0;
	selectedTypes = [];
	selectedElems = [];
}

// Game Logic for Multiplayer
function playGameMulti(socket) {
	if (isGameOver) return;
	if (!ready) {
		socket.emit('player-ready');
		ready = true;
		playerReady(playerNum);
	}

	if (enemyReady) {
		// Here starts the game
		initMultiplayer(socket);
		wrapper.style.display = 'flex';
		connections.style.display = 'none';
	}
}

// Visualizes when a player is ready
function playerReady(num) {
	let player = `.p${parseInt(num) + 1}`;
	document.querySelector(`${player} .ready span`).classList.toggle('green');
}

//////////////////////////////////////////
///////// SINGLEPLAYER MODE //////////////
//////////////////////////////////////////

// Start singleplayer mode
function initSingleplayer() {
	gameMode = 'singleplayer';
	lives = 3;
	for (let i = 0; i < lives; i++) {
		const heart = document.createElement('img');
		heart.classList.add('heart');
		heart.id = 'heart';
		heart.src = './img/heart.png';
		livesElem.appendChild(heart);
	}

	startRound();
}

function startRound() {
	correctTypes = nextRound();
	submit.setAttribute('disabled', true);
	selected = 0;
	selectedTypes = [];
	selectedElems = [];
}

// Decides whether to start a automatically a Singleplayer game or not, based on your url
if (page == 'index.html' || page == '') initSingleplayer();
else wrapper.style.display = 'none';

// Read and handle submitted types for single player mode
submit.addEventListener('click', () => {
	for (let i = 0; i < selectedElems.length; i++) {
		selectedElems[i].style.outline = 'none';
		selectedElems[i].setAttribute('data-selected', 'false');
		if (selectedElems[i].getAttribute('data-type') != null) {
			selectedTypes.push(selectedElems[i].getAttribute('data-type'));
		} else {
			alert('Unexpected Error');
		}
	}

	if (selectedTypes.length < 1) {
		alert("Error: The selected types couldn't be read");
		return startRound();
	}

	if (!arraysEqual(selectedTypes, correctTypes)) {
		lives--;

		if (lives < 0) {
			return playerLoose(selectedTypes, correctTypes, score.innerHTML);
		}

		const hearts = document.querySelectorAll('#heart');
		let lastChild = hearts[hearts.length - (3 - lives)];
		// lastChild.style.filter = 'grayscale(0.8)';
		lastChild.classList.add('fade-out');

		return startRound();
	}

	score.innerHTML++;

	return startRound();
});
