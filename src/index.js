const fs = require('fs');

const europeennes2019 = require('./europeennes2019');
const geojsonFromBureaux = require('./normalise-bureaux/nice-06-088').geojsonFromBureaux;
const reportsMappings = require('../data/europeennes-2019-reports.json').écologie;

europeennes2019.load(`${__dirname}/../data/europeennes-2019-menton.csv`)
	.then(europeennes2019.parse)
	.then(bureaux => {
		fs.writeFile('dist/menton-06-083.mock.js', JSON.stringify(bureaux), err => {
			if (err) throw err;
			console.log('Wrote dist/menton-06-083.mock.js');
		});
	});



europeennes2019.load(`${__dirname}/../data/europeennes-2019-nice.csv`)
	.then(europeennes2019.parse)
	.then(bureaux => {
		let bureauxByAbstention = europeennes2019.sortBureauxBy(bureaux, '% Abs/Ins');
		bureauxByAbstention = bureauxByAbstention.map(bureau => { return { [bureau.Bureau]: bureau['% Abs/Ins'] } });

		let bureauxByEELVScore = europeennes2019.sortBureauxBy(bureaux, '% Voix/Exp EUROPE ÉCOLOGIE');
		bureauxByEELVScore = bureauxByEELVScore.map(bureau => { return { [bureau.Bureau]: bureau['% Voix/Exp EUROPE ÉCOLOGIE'] } });

		let averageReportsMapping = europeennes2019.mergeMappings(reportsMappings);
		let potentialScores = europeennes2019.getPotentialScoresForMapping(bureaux, averageReportsMapping);

		fs.writeFile('dist/bureauxByAbstention.geojson', JSON.stringify(geojsonFromBureaux(bureauxByAbstention)), err => {
			if (err) throw err;
			console.log('Wrote bureauxByAbstention.geojson');
		});

		fs.writeFile('dist/bureauxByEELVScore.geojson', JSON.stringify(geojsonFromBureaux(bureauxByEELVScore)), err => {
			if (err) throw err;
			console.log('Wrote bureauxByEELVScore.geojson');
		});

		fs.writeFile('dist/potentialScores.geojson', JSON.stringify(geojsonFromBureaux(potentialScores)), err => {
			if (err) throw err;
			console.log('Wrote potentialScores.geojson');
		});
	});
