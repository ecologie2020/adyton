function loadHeatMap(sourceFileId, gradient) {
	return fetch(`/dist/${sourceFileId}.geojson`)
		.then(potentialScores => potentialScores.json())
		.then(potentialScores => {
			let values = potentialScores.features.map(bureau => bureau.properties.valeur);
			let min = Math.min(...values),
				max = Math.max(...values);

			let heatMapData = potentialScores.features.map(bureau => [
				bureau.geometry.coordinates[1],
				bureau.geometry.coordinates[0],
				(bureau.properties.valeur - min) / (max - min),  // the heatmap plugin uses elevation as heat intensity, on a 0-1 scale
			]);

			return L.heatLayer(heatMapData, {
				blur: 25,
				gradient,
				maxZoom: 16,
				radius: 50,
			});
		});
}
