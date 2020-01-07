const europeennes2019 = require('./europeennes2019');

const SOURCE_FILE = `${__dirname}/../data/europeennes-2019-nice.csv`;


europeennes2019.load()
	.then(europeennes2019.parse)
	.then(bureaux => {
		let bureauxByAbstention = europeennes2019.sortBureauxBy(bureaux, '% Abs/Ins');
		let bureauxByEELVScore = europeennes2019.sortBureauxBy(bureaux, '% Voix/Exp EUROPE ÉCOLOGIE');

		console.log('10 bureaux avec la plus forte abstention :', bureauxByAbstention.slice(0, 10).map(bureau => { return { [bureau.Bureau]: bureau['% Abs/Ins'] } }));
		console.log('10 bureaux avec le plus fort score EELV :', bureauxByEELVScore.slice(0, 10).map(bureau => { return { [bureau.Bureau]: bureau['% Voix/Exp EUROPE ÉCOLOGIE'] } }));
	});
