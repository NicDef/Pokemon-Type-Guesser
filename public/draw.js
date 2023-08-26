const allTypes = {
	normal: {
		imageSrc: './img/32px-Pokémon_Normal_Type_Icon.svg.png',
	},
	fighting: {
		imageSrc: './img/32px-Pokémon_Fighting_Type_Icon.svg.png',
	},
	flying: {
		imageSrc: './img/32px-Pokémon_Flying_Type_Icon.svg.png',
	},
	poison: {
		imageSrc: './img/32px-Pokémon_Poison_Type_Icon.svg.png',
	},
	ground: {
		imageSrc: './img/32px-Pokémon_Ground_Type_Icon.svg.png',
	},
	rock: {
		imageSrc: './img/32px-Pokémon_Rock_Type_Icon.svg.png',
	},
	bug: {
		imageSrc: './img/32px-Pokémon_Bug_Type_Icon.svg.png',
	},
	ghost: {
		imageSrc: './img/32px-Pokémon_Ghost_Type_Icon.svg.png',
	},
	steel: {
		imageSrc: './img/32px-Pokémon_Steel_Type_Icon.svg.png',
	},
	fire: {
		imageSrc: './img/32px-Pokémon_Fire_Type_Icon.svg.png',
	},
	water: {
		imageSrc: './img/32px-Pokémon_Water_Type_Icon.svg.png',
	},
	grass: {
		imageSrc: './img/32px-Pokémon_Grass_Type_Icon.svg.png',
	},
	electric: {
		imageSrc: './img/32px-Pokémon_Electric_Type_Icon.svg.png',
	},
	psychic: {
		imageSrc: './img/32px-Pokémon_Psychic_Type_Icon.svg.png',
	},
	ice: {
		imageSrc: './img/32px-Pokémon_Ice_Type_Icon.svg.png',
	},
	dragon: {
		imageSrc: './img/32px-Pokémon_Dragon_Type_Icon.svg.png',
	},
	dark: {
		imageSrc: './img/32px-Pokémon_Dark_Type_Icon.svg.png',
	},
	fairy: {
		imageSrc: './img/32px-Pokémon_Fairy_Type_Icon.svg.png',
	},
};

const removeKeys = (obj, keys, removeNot) => {
	do {
		let rndIndex = Math.floor(Math.random() * keys.length);
		for (let i = 0; i < removeNot.length; i++) {
			if (rndIndex === keys.indexOf(removeNot[i])) return removeKeys(obj, keys, removeNot);
		}
		keys.splice(rndIndex, 1);
	} while (keys.length > 7);
	return keys;
};

function draw(name, imageSrc, types) {
	const imgElem = document.querySelector('#pokemonImage');
	const nameElem = document.querySelector('#name');

	imgElem.src = imageSrc;
	nameElem.innerHTML = name;

	const keys = Object.keys(allTypes);

	const optionTypes = removeKeys(allTypes, keys, types);

	// Map any number group to any other number group
	const fisherYatesShuffle = (deck) => {
		for (var i = deck.length - 1; i > 0; i--) {
			const swapIndex = Math.floor(Math.random() * (i + 1));
			const currentCard = deck[i];
			const cardToSwap = deck[swapIndex];
			deck[i] = cardToSwap;
			deck[swapIndex] = currentCard;
		}

		return deck;
	};
	const shuffled = fisherYatesShuffle(optionTypes);

	const conversion = {};
	// i + 1 because we want 1-9 as keys and arrays start at index 0
	shuffled.forEach((e, i) => (conversion[i + 1] = e));

	const typeImgElem = document.querySelectorAll('.img');
	for (let i = 0; i < typeImgElem.length; i++) {
		typeImgElem[i].src = allTypes[keys[i]].imageSrc;
		typeImgElem[i].setAttribute('data-type', String(keys[i]));
	}
	return types;
}

function displaySuggestedTypes(suggestedTypes) {
	const typeImgElem = document.querySelectorAll('.img');
	for (let i = 0; i < typeImgElem.length; i++) {
		typeImgElem[i].src = suggestedTypes[i].imageSrc;
		// typeImgElem[i].setAttribute('data-type', String(keys[i]));
	}
}
