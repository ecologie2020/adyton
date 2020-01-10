const fs = require('fs');

const europeennes2019 = require('./europeennes2019');
const LISTES = require('../data/europeennes-2019-listes').listes;


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
		return europeennes2019.parse(fileContents).then(subject => {
			expect(subject).toBeInstanceOf(Array);
			expect(subject).toHaveLength(3);
			expect(subject[0]).toHaveProperty('Inscrits', '784');
			expect(subject[0]).toHaveProperty('Voix LA FRANCE INSOUMISE', '6');
			expect(subject[0]).toHaveProperty('Voix UNE FRANCE ROYALE', '0');

			parsedData = subject;
		});
	});

	test('sorts by integer values', () => {
		let subject = europeennes2019.sortBureauxBy(parsedData, 'Inscrits');

		expect(subject).toBeInstanceOf(Array);
		expect(subject).toHaveLength(3);
		expect(subject[0]).toHaveProperty('Inscrits', '793');
		expect(subject[1]).toHaveProperty('Inscrits', '784');
		expect(subject[2]).toHaveProperty('Inscrits', '79');
	});

	test('sorts by decimal values', () => {
		let subject = europeennes2019.sortBureauxBy(parsedData, '% Abs/Ins');

		expect(subject).toBeInstanceOf(Array);
		expect(subject).toHaveLength(3);
		expect(subject[0]).toHaveProperty('% Abs/Ins', '70');
		expect(subject[1]).toHaveProperty('% Abs/Ins', '57,76');
		expect(subject[2]).toHaveProperty('% Abs/Ins', '50,13');
	});

	test('computes vote potential according to mapping table', () => {
		let mapping = LISTES.reduce((mapping, listeName) => {
			mapping[listeName] = 0.1;
			return mapping;
		}, {});
		mapping['LA FRANCE INSOUMISE'] = 0.8;

		const subject = europeennes2019.getPotentialScoresForMapping(parsedData, mapping);

		expect(subject).toBeInstanceOf(Array);
		expect(subject).toHaveLength(3);
		expect(subject[0]).toHaveProperty('0102');
		expect(subject[1]).toHaveProperty('0101');
		expect(subject[2]).toHaveProperty('0203');
		expect(subject[0]['0102']).toBeCloseTo(42.7, 3);
		expect(subject[1]['0101']).toBeCloseTo(43, 3);
		expect(subject[2]['0203']).toBeCloseTo(56.7, 3);
	});

	test('merges mappings', () => {
		let mapping1 = {},
			mapping2 = {};

		LISTES.forEach(listeName => {
			mapping1[listeName] = 0.1;
			mapping2[listeName] = 0.5;
		});
		mapping1['LA FRANCE INSOUMISE'] = 0.9;
		mapping2['LA FRANCE INSOUMISE'] = 0.7;

		let subject = europeennes2019.mergeMappings([ mapping1, mapping2 ]);

		expect(subject).toHaveProperty('LA FRANCE INSOUMISE', 0.8);
		expect(subject).toHaveProperty('UNE FRANCE ROYALE', 0.3);
		expect(subject).toHaveProperty('LA LIGNE CLAIRE', 0.3);
	});
});
