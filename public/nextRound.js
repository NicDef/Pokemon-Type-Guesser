// import draw from './draw.js';
// import getRandomPokemon from './getRandomPokemon.js';

const baseUrl = 'https://pokeapi.co/api/v2/pokemon/';

async function getData(url) {
	const response = await fetch(url);

	return response.json();
}

const notThese = [];
function nextRound() {
	const pokemonIdx = getRandomPokemon(notThese);
	const types = [];

	getData(baseUrl + pokemonIdx).then((data) => {
		const name = data.name;
		const imageSrc = data.sprites.front_default;
		for (let i = 0; i < data.types.length; i++) {
			types.push(data.types[i].type.name);
		}

		return draw(name, imageSrc, types);
	});

	return types;
}

// export default nextRound;
