const fs = require('fs').promises;

const _ = require('lodash');
const parse = require('csv-parse');


const SOURCE_FILE = `${__dirname}/../data/europeennes-2019-nice.csv`;
const LISTES_NAMES = require('../data/europeennes-2019-listes.json').listes;

function loadFile(source = SOURCE_FILE) {
	return fs.readFile(source);
}

function parseEuropeennes2019(data) {
	return new Promise((resolve, reject) => {
		parse(data, {
			columns: getColumns(),
			delimiter: ';',
			relax_column_count: true,  // we transform each record, columns count cannot match at first
		}, (err, content) => {
			if (err) reject(err);
			resolve(content);
		});
	});
}

function sortBureauxBy(bureaux, type) {
	let bureauxByAbstention = _.sortBy(bureaux, bureau => { return +(bureau[type].replace(',', '.')) });
	bureauxByAbstention.reverse();

	return bureauxByAbstention;
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


module.exports = {
	load: loadFile,
	parse: parseEuropeennes2019,
	sortBureauxBy,
}
