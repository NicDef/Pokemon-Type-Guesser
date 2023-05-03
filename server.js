const express = require('express');
const path = require('path');
const http = require('http');
const PORT = process.env.PORT || 3000;
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketio(server);

const url = `http://localhost:${PORT}`;

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Start server
server.listen(PORT, () => console.log(`Server is running on Port ${PORT} --> ` + url));

// Handle a socket connection request

const connections = [null, null];

io.on('connection', (socket) => {
	// Find an available player number
	let playerIndex = -1;
	for (const i in connections) {
		if (connections[i] === null) {
			playerIndex = i;
			break;
		}
	}

	// Tell the connecting client what number if player they are
	socket.emit('player-number', playerIndex);

	console.log(`Player ${playerIndex} has connected`);

	// Ignore player 3
	if (playerIndex === -1) return;

	connections[playerIndex] = false;

	// Tell everyone what playerNumber just connected
	socket.broadcast.emit('player-connection', playerIndex);

	// Handle disconnect
	socket.on('disconnect', () => {
		console.log(`Player ${playerIndex} disconnected`);
		connections[playerIndex] = null;
		// Tell everyone what player number just disconnected
		socket.broadcast.emit('player-connection', playerIndex);
	});

	// On ready
	socket.on('player-ready', () => {
		socket.broadcast.emit('enemy-ready', playerIndex);
		connections[playerIndex] = true;
	});

	// Check player connections
	socket.on('check-players', () => {
		const players = [];
		for (const i in connections) {
			connections[i] == null ? players.push({ connected: false, ready: false }) : players.push({ connected: true, ready: connections[i] });
		}
		socket.emit('check-players', players);
	});

	// On new multi player round
	socket.once('next-round', (pokemonIdx) => {
		io.emit('correct-types', pokemonIdx);
	});

	io.once('suggested-types', (params) => {
		console.log('Hallo');
		socket.emit('display-suggested-types', params);
	});

	// On correct types
	// socket.on('draw', (pokemonIdx) => {});
});
