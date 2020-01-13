const nice = require('./nice-06-088');

const PARSED_BUREAUX_DATA = require('./nice-06-088.mock');


describe('Geojson', () => {
	test('is generated', () => {
		let data = PARSED_BUREAUX_DATA.map(bureau => { return { [bureau.Bureau]: bureau.Inscrits } });

		expect(nice.geojsonFromBureaux(data)).toEqual({
			"type": "FeatureCollection",
			"features": [
				{
					"type": "Feature",
					"geometry": {
						"type": "Point",
						"coordinates": [
							7.25892245,
							43.69524528
						]
					},
					"properties": {
						"id": "102",
						"name": "MEYERBEER",
						"valeur": "784"
					}
				},
				{
					"type": "Feature",
					"geometry": {
						"type": "Point",
						"coordinates": [
							7.25892245,
							43.69524528
						]
					},
					"properties": {
						"id": "101",
						"name": "MASSENA",
						"valeur": "793"
					}
				},
				{
					"type": "Feature",
					"geometry": {
						"type": "Point",
						"coordinates": [
							7.23342081,
							43.68530115
						]
					},
					"properties": {
						"id": "203",
						"name": "SAINTE HELENE",
						"valeur": "79"
					}
				}
			]
		});
	});
});
