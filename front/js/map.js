let map = L.map('map').setView([ 43.71, 7.26 ], 13);
let osmLayer = L.tileLayer('https://a.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '© OpenStreetMap contributors',
	maxZoom: 15
});
map.addLayer(osmLayer);
let control = L.control.layers().addTo(map).expand();

fetch('/dist/potentialScores.geojson')
	.then(potentialScores => potentialScores.json())
	.then(potentialScores => {
		let maxScore = Math.max(...potentialScores.features.map(bureau => bureau.properties.valeur));
		let heatMapData = potentialScores.features.map(bureau => [
			bureau.geometry.coordinates[1],
			bureau.geometry.coordinates[0],
			bureau.properties.valeur,  // the heatmap plugin uses elevation as heat intensity, on a 0-1 scale
		]);

		let electorat = L.heatLayer(heatMapData, {
			blur: 25,
			max: maxScore,
			maxZoom: 16,
			radius: 50,
		}).addTo(map);

		control.addOverlay(electorat, '<abbr title="Sur la base des élections européennes 2019, avec des taux de report par liste estimés par la moyenne de 4 personnes de l’équipe Nice Écologique.">Électorat écologiste</abbr>');
	});

fetch('/dist/bureauxByAbstention.geojson')
	.then(bureauxByAbstention => bureauxByAbstention.json())
	.then(bureauxByAbstention => {
		let bureaux = L.geoJSON(bureauxByAbstention)
			.bindPopup(layer => `Abstention : ${Math.floor(layer.feature.properties.valeur)}`)
			.addTo(map);

		control.addOverlay(bureaux, 'Bureaux de vote');

		let maxAbstention = Math.max(...bureauxByAbstention.features.map(bureau => bureau.properties.valeur));
		let heatMapData = bureauxByAbstention.features.map(bureau => [
			bureau.geometry.coordinates[1],
			bureau.geometry.coordinates[0],
			bureau.properties.valeur,  // the heatmap plugin uses elevation as heat intensity, on a 0-1 scale
		]);

		let abstention = L.heatLayer(heatMapData, {
			blur: 25,
			max: maxAbstention,
			maxZoom: 16,
			radius: 50,
		}).addTo(map);

		control.addOverlay(abstention, 'Abstention Européennes 2019');
	});
