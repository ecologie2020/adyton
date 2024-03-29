const fs = require('fs').promises;

const _ = require('lodash');
const parse = require('csv-parse');

const LISTES_NAMES = require('../data/europeennes-2019-listes.json').listes;


function loadFile(source) {
	return fs.readFile(source);
}

function parseEuropeennes2019(data) {
	return new Promise((resolve, reject) => {
		parse(data, {
			columns: getColumns(),
			delimiter: ';',
			on_record: cast,
			relax_column_count: true,  // we transform each record, columns count cannot match at first
		}, (err, content) => {
			if (err) reject(err);
			resolve(content);
		});
	});
}

function sortBureauxBy(bureaux, type) {
	return _.sortBy(bureaux, type).reverse();
}

function mergeMappings(mappings) {
	return Object.keys(mappings[0]).reduce((result, listeName) => {
		result[listeName] = mappings.reduce((sum, mapping) => sum + mapping[listeName], 0);
		result[listeName] /= mappings.length;
		return result;
	}, {});
}

function getPotentialScoresForMapping(bureaux, mapping) {
	return bureaux.map(bureau => {
		let potentialScore = LISTES_NAMES.reduce((potentialScore, listeName) => {
			return potentialScore + (+bureau[`Voix ${listeName}`]) * mapping[listeName];
		}, 0);

		return { [bureau.Bureau]: potentialScore };
	}, {});
}

function getColumns() {
	let result = [
		'Code du département',
		'Libellé du département',
		'Code de la commune',
		'Libellé de la commune',
		'Bureau',	// 'Code du b.vote',
		'Inscrits',
		'Abstentions',
		'% Abs/Ins',
		'Votants',
		'% Vot/Ins',
		'Blancs',
		'% Blancs/Ins',
		'% Blancs/Vot',
		'Nuls',
		'% Nuls/Ins',
		'% Nuls/Vot',
		'Exprimés',
		'% Exp/Ins',
		'% Exp/Vot',
		/* this part is repeated for each liste */
		// 'N° Liste',
		// 'Libellé Abrégé Liste',
		// 'Libellé Etendu Liste',
		// 'Nom Tête de Liste',
		// 'Voix',
		// '% Voix/Ins',
		// '% Voix/Exp',
		// /* end of repeated part */
	];

	return LISTES_NAMES.reduce((result, listeName) => {  // TOOPTIMIZE: use splice instead of reduce to modify array in place
		return result.concat([
			`N° Liste ${listeName}`,
			`Libellé Abrégé Liste ${listeName}`,
			`Libellé Etendu Liste ${listeName}`,
			`Nom Tête de Liste ${listeName}`,
			`Voix ${listeName}`,
			`% Voix/Ins ${listeName}`,
			`% Voix/Exp ${listeName}`,
		]);
	}, result);
}

let NUMBER_FIELDS = /^(%|Inscrits|Abstentions|Votants|Blancs|Nuls|Exprimés|N°|Voix)/;
function cast(record) {
	Object.keys(record).forEach(fieldName => {  // TOOPTIMIZE: for..in instead of function
		if (fieldName.match(NUMBER_FIELDS))
			record[fieldName] = Number(record[fieldName].replace(',', '.'));
	});

	return record;
}


module.exports = {
	getPotentialScoresForMapping,
	load: loadFile,
	mergeMappings,
	parse: parseEuropeennes2019,
	sortBureauxBy,
}
