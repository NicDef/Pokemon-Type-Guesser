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

let correctTypes = [];
let selectedTypes = [];
let lives = 3;

let page = window.location.href.replace(/(.*)\//, '');

//////////////////////////////////////////
///////// SINGLEPLAYER MODE //////////////
//////////////////////////////////////////

// Start singleplayer mode
function initSingleplayer() {
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
