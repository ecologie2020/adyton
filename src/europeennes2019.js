const _ = require('lodash');
const parse = require('csv-parse');


const LISTES_NAMES = require('../data/europeennes-2019-listes.json').listes;


function parseEuropeennes2019(data, callback) {
	return parse(data, {
		columns: getColumns(),
		delimiter: ';',
		on_record: filterBureau,
		relax_column_count: true,  // we transform each record, columns count cannot match at first
	}, callback);
}

function sortBureauxBy(bureaux, type) {
	let bureauxByAbstention = _.sortBy(bureaux, bureau => { return +(bureau[type].replace(',', '.')) });
	bureauxByAbstention.reverse();

	return bureauxByAbstention;
}

function getColumns() {
	const FIXED_COLUMNS = [
		// 'Code du département',
		// 'Libellé du département',
		// 'Code de la commune',
		// 'Libellé de la commune',
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

	return FIXED_COLUMNS.concat(LISTES_NAMES);
}

/**
* @see	#getColumns	To understand the original shape and how we navigate it
*/
function filterBureau(bureau) {
	console.log('>> bureau:', bureau);
	const result = bureau.slice(4, 19);  // remove unused département and commune identifiers
	const voix = LISTES_NAMES.map((listeName, listeIndex) => bureau[19 + listeIndex * 7]);  // TOOPTIMIZE: inline indexes
	return result.concat(voix);
}


module.exports = {
	parse: parseEuropeennes2019,
	sortBureauxBy,
}
