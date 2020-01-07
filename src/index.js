const fs = require('fs');

const europeennes2019 = require('./europeennes2019');

const SOURCE_FILE = `${__dirname}/../data/europeennes-2019-nice.csv`;


fs.readFile(SOURCE_FILE, (err, contents) => {
	if (err)
		throw err;

	europeennes2019.parse(contents, (err, bureaux) => {
		if (err)
			throw err;

		let sortedBureaux = europeennes2019.sortBureauxBy(bureaux, '% Abs/Ins');
		console.log('10 bureaux avec la plus forte abstention :', sortedBureaux.slice(0, 10));
	});
});
