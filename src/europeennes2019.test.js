const fs = require('fs');

const europeennes2019 = require('./europeennes2019');


let fileContents,
	parsedData;

beforeAll(done => {
	fs.readFile(`${__dirname}/../test/mock/europeennes-2019-nice-head2.csv`, (err, contents) => {
		if (err)
			throw err;

		fileContents = contents;

		done();
	});
});

describe('Européennes 2019', () => {
	test('parses', done => {
		europeennes2019.parse(fileContents, (err, bureaux) => {
			if (err)
				throw err;

			expect(bureaux).toBeInstanceOf(Array);
			expect(bureaux).toHaveLength(2);
			expect(bureaux[0]).toHaveProperty('Inscrits', '784');

			parsedData = bureaux;

			done();
		});
	});

	test('sorts', () => {
		let sortedBureaux = europeennes2019.sortBureauxBy(parsedData, 'Inscrits');

		expect(sortedBureaux).toBeInstanceOf(Array);
		expect(sortedBureaux).toHaveLength(2);
		expect(sortedBureaux[0]).toHaveProperty('Inscrits', '793');
		expect(sortedBureaux[1]).toHaveProperty('Inscrits', '784');
	});
});
