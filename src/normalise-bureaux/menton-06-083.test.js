const menton = require('./menton-06-083');

const PARSED_BUREAUX_DATA = require('./menton-06-083.mock.json');


describe('Geojson', () => {
	test('is generated', () => {
		let data = PARSED_BUREAUX_DATA.map(bureau => { return { [bureau.Bureau]: bureau.Inscrits } });

		const subject = menton.geojsonFromBureaux(data);

		expect(subject).toHaveProperty('type', 'FeatureCollection');
		expect(subject.features).toHaveLength(28);
		expect(subject.features.slice(0, 3)).toEqual([
			{
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [
						7.50280648469925,
						43.77569281600124
					]
				},
				"properties": {
					"id": "0001",
					"name": "<p>Secteur centre-ville<br class='autobr' />\nHôtel de ville, <br class='autobr' />\n17 rue de la République<br class='autobr' />\n06500 Menton</p>",
					"valeur": 433
				}
			},
			{
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [
					7.502044737339021,
					43.77627769630134
				]
				},
				"properties": {
					"id": "0002",
					"name": "<p>Secteur centre-ville <br class='autobr' />\nÉcole de l’Hôtel de Ville<br class='autobr' />\nrue saint Charles<br class='autobr' />\n06500 Menton</p>",
					"valeur": 796
				}
			},
			{
				"type": "Feature",
				"geometry": {
					"type": "Point",
					"coordinates": [
					7.502044737339021,
					43.77627769630134
				]
				},
				"properties": {
					"id": "0003",
					"name": "<p>Secteur centre-ville <br class='autobr' />\nÉcole de l’Hôtel de Ville<br class='autobr' />\nrue saint Charles<br class='autobr' />\n06500 Menton</p>",
					"valeur": 476
				}
			}
		]);
	});
});
