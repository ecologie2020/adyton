const _ = require('lodash');
const parse = require('csv-parse');


const COLUMNS = [
	'Code du département',
	'Libellé du département',
	'Code de la commune',
	'Libellé de la commune',
	'Code du b.vote',
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
	/* cette partie se répète pour chaque liste */
	'N° Liste',
	'Libellé Abrégé Liste',
	'Libellé Etendu Liste',
	'Nom Tête de Liste',
	'Voix',
	'% Voix/Ins',
	'% Voix/Exp',
	/* fin de la partie répétée */
]


function parseEuropeennes2019(data, callback) {
	return parse(data, {
		columns: COLUMNS,
		delimiter: ';',
		relax_column_count: true,  // support repeating part
	}, callback);
}

function sortBureauxBy(bureaux, type) {
	let bureauxByAbstention = _.sortBy(bureaux, bureau => { return bureau[type] });
	bureauxByAbstention.reverse();

	return bureauxByAbstention;
}

module.exports = {
	parse: parseEuropeennes2019,
	sortBureauxBy,
}
