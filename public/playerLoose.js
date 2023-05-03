function animateValue(obj, start, end, duration) {
	let startTimestamp = null;
	const step = (timestamp) => {
		if (!startTimestamp) startTimestamp = timestamp;
		const progress = Math.min((timestamp - startTimestamp) / duration, 1);
		obj.innerHTML = Math.floor(progress * (end - start) + start);
		if (progress < 1) {
			window.requestAnimationFrame(step);
		}
	};
	window.requestAnimationFrame(step);
}

function playerLoose(selectedTypes, correctTypes, score) {
	const name = document.querySelector('#name');
	const scoreCount = document.querySelector('#score');
	const scoreCtn = document.querySelector('.score');
	const pokemonContainer = document.querySelector('.pokemon-ctn');
	const pokemonImgContainer = document.querySelector('.pokemon-image-ctn');
	const typesCtn = document.querySelector('.types-ctn');

	const typeImgElems = document.querySelectorAll('.img');

	name.innerHTML = '';

	scoreCtn.classList.add('score-lose');
	pokemonContainer.classList.add('pokemon-ctn-lose');
	pokemonImgContainer.style.display = 'none';
	typesCtn.classList.add('types-ctn-lose');

	if (score > 0) animateValue(scoreCount, 0, score, (score * 60) / 0.1);

	// Outline the chosen answers &
	// only keep images of correct answers
	let imgToKeep = [];
	for (let i = 0; i < typeImgElems.length; i++) {
		typeImgElems[i].classList.add('img-lose');
		if (correctTypes.includes(typeImgElems[i].getAttribute('data-type'))) imgToKeep.push(typeImgElems[i].className.split(' ')[1]);
	}

	let imgSelected = [];
	for (let i = 0; i < typeImgElems.length; i++) {
		if (selectedTypes.includes(typeImgElems[i].getAttribute('data-type'))) imgSelected.push(typeImgElems[i].className.split(' ')[1]);
		if (!imgToKeep.includes(typeImgElems[i].className.split(' ')[1])) {
			typeImgElems[i].src = './img/32px-Transparent.png';
			typeImgElems[i].style.boxShadow = 'none';
		}
	}

	for (let i = 0; i < typeImgElems.length; i++) {
		if (imgSelected.includes(typeImgElems[i].className.split(' ')[1])) {
			typeImgElems[i].style.outline = '2px solid hsl(0, 0%, 91%)';
		}
	}

	document.querySelector('.submit').addEventListener('click', () => {
		window.parent.parent.window.location = './index.html';
	});
}
