const _ = require('lodash');
const GeoJSON = require('geojson');


/**
*@param	Object<Object>	bureauxData	Key: bureau ID, value: bureau properties to set in GeoJSON.
*/
function geojsonFromBureaux(bureauxData) {
	let markers = require('../../data/bureaux-2019-menton.json').features;

	let result = [];

	const bureauIdMatcher = /([0-9]+)<sup>/g;  // Bureaux at the same location are grouped in a single marker, we can detect them as the marker title is like "<a href='Bureaux-de-vote.html'>26<sup>ème</sup> 27<sup>ème</sup> bureaux  de vote </a>"

	markers.forEach((marker, markerIndex) => {
		[...marker.properties.title.matchAll(bureauIdMatcher)].forEach((match, matchIndex) => {
			let bureauId = match[1];

			result.push({
				lat: marker.geometry.coordinates[1],
				lng: marker.geometry.coordinates[0],
				id: bureauId.padStart(4, '0'),
				name: marker.properties.description,
				valeur: bureauxData[bureauId - 1][bureauId.padStart(4, '0')],  // TODO: this should be left to the caller to merge, this normaliser should only provide a normalised bureaux view, as GeoJSON or another lighter format
			});
		});
	});

	return GeoJSON.parse(result, { Point: ['lat', 'lng'] });
}


module.exports = {
	geojsonFromBureaux,
}
