const fs = require('fs');

const europeennes2019 = require('./europeennes2019');


let fileContents,
	parsedData;

beforeAll(done => {
	fs.readFile(`${__dirname}/../test/mock/europeennes-2019-nice-mock.csv`, (err, contents) => {
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
			expect(bureaux).toHaveLength(3);
			expect(bureaux[0]).toHaveProperty('Inscrits', '784');
			expect(bureaux[0]).toHaveProperty('LA FRANCE INSOUMISE', '6');
			expect(bureaux[0]).toHaveProperty('UNE FRANCE ROYALE', '0');

			parsedData = bureaux;

			done();
		});
	});

	test('sorts by integer values', () => {
		let sortedBureaux = europeennes2019.sortBureauxBy(parsedData, 'Inscrits');

		expect(sortedBureaux).toBeInstanceOf(Array);
		expect(sortedBureaux).toHaveLength(3);
		expect(sortedBureaux[0]).toHaveProperty('Inscrits', '793');
		expect(sortedBureaux[1]).toHaveProperty('Inscrits', '784');
		expect(sortedBureaux[2]).toHaveProperty('Inscrits', '79');
	});

	test('sorts by decimal values', () => {
		let sortedBureaux = europeennes2019.sortBureauxBy(parsedData, '% Abs/Ins');

		expect(sortedBureaux).toBeInstanceOf(Array);
		expect(sortedBureaux).toHaveLength(3);
		expect(sortedBureaux[0]).toHaveProperty('% Abs/Ins', '70');
		expect(sortedBureaux[1]).toHaveProperty('% Abs/Ins', '57,76');
		expect(sortedBureaux[2]).toHaveProperty('% Abs/Ins', '50,13');
	});
});
