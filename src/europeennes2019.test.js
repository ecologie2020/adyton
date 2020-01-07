const fs = require('fs');

const europeennes2019 = require('./europeennes2019');


let fileContents,
	parsedData;

beforeAll(() => {
	return europeennes2019.load(`${__dirname}/../test/mock/europeennes-2019-nice-mock.csv`)
		.then(contents => {
			fileContents = contents;
		});
});

describe('Européennes 2019', () => {
	test('parses', () => {
		return europeennes2019.parse(fileContents).then(bureaux => {
			expect(bureaux).toBeInstanceOf(Array);
			expect(bureaux).toHaveLength(3);
			expect(bureaux[0]).toHaveProperty('Inscrits', '784');
			expect(bureaux[0]).toHaveProperty('Voix LA FRANCE INSOUMISE', '6');
			expect(bureaux[0]).toHaveProperty('Voix UNE FRANCE ROYALE', '0');

			parsedData = bureaux;
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
