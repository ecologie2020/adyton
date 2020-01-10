const fs = require('fs');

const europeennes2019 = require('./europeennes2019');
const geojsonFromBureaux = require('./geo').geojsonFromBureaux;
const reportsMappings = require('../data/europeennes-2019-reports.json').écologie;

const SOURCE_FILE = '../data/europeennes-2019-nice.csv';


europeennes2019.load()
	.then(europeennes2019.parse)
	.then(bureaux => {
		let bureauxByAbstention = europeennes2019.sortBureauxBy(bureaux, '% Abs/Ins');
		let bureauxByEELVScore = europeennes2019.sortBureauxBy(bureaux, '% Voix/Exp EUROPE ÉCOLOGIE');
		bureauxByEELVScore = bureauxByEELVScore.slice(0, 10).map(bureau => { return { [bureau.Bureau]: bureau['% Voix/Exp EUROPE ÉCOLOGIE'] } });
		bureauxByAbstention = bureauxByAbstention.slice(0, 25).map(bureau => { return { [bureau.Bureau]: bureau['% Abs/Ins'] } });

		let averageReportsMapping = europeennes2019.mergeMappings(reportsMappings);

		console.log('10 bureaux avec la plus forte abstention :', bureauxByAbstention);
		console.log('10 bureaux avec le plus fort score EELV :', bureauxByEELVScore);
		console.log('Score potentiel par bureau (moyenne des estimations) :', europeennes2019.getPotentialScoresForMapping(bureaux, averageReportsMapping));

		fs.writeFile('dist/bureauxByEELVScore.geojson', JSON.stringify(geojsonFromBureaux(bureauxByEELVScore)), err => {
			if (err) throw err;
			console.log('Wrote bureauxByEELVScore.geojson');
		});
	});
