const MAX_DEX_INDEX = 493; // 4th Generation

const getRandomPokemon = (notThese) => {
	const pokedexNumber = Math.floor(Math.random() * MAX_DEX_INDEX);

	if (!notThese.includes(pokedexNumber)) {
		notThese.push(pokedexNumber);
		return pokedexNumber;
	}

	try {
		if (notThese.length < MAX_DEX_INDEX) return getRandomPokemon(notThese);
	} catch (e) {
		if (e instanceof RangeError) {
			return playerWin();
		}
	}
};
