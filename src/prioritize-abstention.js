const fs = require('fs');

const _ = require('lodash');
const parse = require('csv-parse');

const SOURCE_FILE = `${__dirname}/../data/europeennes-2019-nice.csv`;

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


fs.readFile(SOURCE_FILE, (err, contents) => {
	if (err)
		throw err;

	parse(contents, {
		columns: COLUMNS,
		delimiter: ';',
		relax_column_count: true,  // support repeating part
	}, (err, bureaux) => {
		if (err)
			throw err;

		let bureauxByAbstention = _.sortBy(bureaux, bureau => { return bureau['% Abs/Ins'] });
		bureauxByAbstention.reverse();

		console.log(bureauxByAbstention.slice(0, 10));
	});
});
