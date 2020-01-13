const fs = require('fs');

const europeennes2019 = require('./europeennes2019');
const mapNice = require('./normalise-bureaux/nice-06-088').geojsonFromBureaux;
const mapMenton = require('./normalise-bureaux/menton-06-083').geojsonFromBureaux;
const reportsMappings = require('../data/europeennes-2019-reports.json').écologie;

europeennes2019.load(`${__dirname}/../data/europeennes-2019-menton.csv`)
	.then(europeennes2019.parse)
	.then(bureaux => {
		let bureauxByAbstention = bureaux.map(bureau => { return { [bureau.Bureau]: bureau['% Abs/Ins'] } });

		let averageReportsMapping = europeennes2019.mergeMappings(reportsMappings);
		let potentialScores = europeennes2019.getPotentialScoresForMapping(bureaux, averageReportsMapping);

		fs.writeFile('dist/bureauxByAbstention-menton.geojson', JSON.stringify(mapMenton(bureauxByAbstention)), err => {
			if (err) throw err;
			console.log('Wrote bureauxByAbstention-menton.geojson');
		});

		fs.writeFile('dist/potentialScores-menton.geojson', JSON.stringify(mapMenton(potentialScores)), err => {
			if (err) throw err;
			console.log('Wrote potentialScores-menton.geojson');
		});
	});



europeennes2019.load(`${__dirname}/../data/europeennes-2019-nice.csv`)
	.then(europeennes2019.parse)
	.then(bureaux => {
		let bureauxByAbstention = europeennes2019.sortBureauxBy(bureaux, '% Abs/Ins');
		bureauxByAbstention = bureauxByAbstention.map(bureau => { return { [bureau.Bureau]: bureau['% Abs/Ins'] } });

		let averageReportsMapping = europeennes2019.mergeMappings(reportsMappings);
		let potentialScores = europeennes2019.getPotentialScoresForMapping(bureaux, averageReportsMapping);

		fs.writeFile('dist/bureauxByAbstention-nice.geojson', JSON.stringify(mapNice(bureauxByAbstention)), err => {
			if (err) throw err;
			console.log('Wrote bureauxByAbstention-nice.geojson');
		});

		fs.writeFile('dist/potentialScores-nice.geojson', JSON.stringify(mapNice(potentialScores)), err => {
			if (err) throw err;
			console.log('Wrote potentialScores-nice.geojson');
		});
	});
