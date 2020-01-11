function loadHeatMap(sourceFileId, color) {
	return fetch(`/dist/${sourceFileId}.geojson`)
		.then(potentialScores => potentialScores.json())
		.then(potentialScores => {
			let maxScore = Math.max(...potentialScores.features.map(bureau => bureau.properties.valeur));
			let heatMapData = potentialScores.features.map(bureau => [
				bureau.geometry.coordinates[1],
				bureau.geometry.coordinates[0],
				bureau.properties.valeur,  // the heatmap plugin uses elevation as heat intensity, on a 0-1 scale
			]);

			return L.heatLayer(heatMapData, {
				blur: 25,
				max: maxScore,
				maxZoom: 16,
				radius: 50,
			});
		});
}
