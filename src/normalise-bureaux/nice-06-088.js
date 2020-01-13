const _ = require('lodash');
const GeoJSON = require('geojson');


/**
*@param	Object<Object>	bureauxData	Key: bureau ID, value: bureau properties to set in GeoJSON.
*/
function geojsonFromBureaux(bureauxData) {
	let bureauxNice = require('../../data/bureaux-2018-nice.json').docs;
	bureauxNice = _.keyBy(bureauxNice, 'N_BUREAU');

	let result = [];

	bureauxData.forEach(bureauData => {
		let bureauIdWithPadding = Object.keys(bureauData)[0];
		let bureauId = bureauIdWithPadding.slice(1);
		result.push({
			lat: bureauxNice[bureauId].geometry.coordinates[1],
			lng: bureauxNice[bureauId].geometry.coordinates[0],
			id: bureauId,
			name: bureauxNice[bureauId].NOM,
			valeur: bureauData[bureauIdWithPadding],
		});
	});

	return GeoJSON.parse(result, { Point: ['lat', 'lng'] });
}


module.exports = {
	geojsonFromBureaux,
}
