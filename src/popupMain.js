import {countryObject} from './DataManager';
import Overlay from 'ol/overlay';
import {select, selectAll} from 'd3-selection';

export default class Popup {
	constructor(map) {
		let olMap = map,
			countries = countryObject(),
			width = 400,
			height = 400,
			data = [10, 20, 30],
			colors = ['green', 'purple', 'yellow'];

		const overlay = new Overlay({
			element: document.getElementById('popup-container'),
			positioning: 'bottom-center',
			offset: [0, -10],
			autoPan: true
		});
		overlay.getElement().addEventListener('click', function () {
			overlay.setPosition();
		});

		olMap.addOverlay(overlay);
		olMap.on('click', function (e) {
			console.log("clicked");
			olMap.forEachFeatureAtPixel(e.pixel, function (feature) {
				const country = countries[feature.getId()];
				const properties = feature.getProperties();
				resetMarkup();
				document.getElementById('header').innerHTML = properties['name'];
				if (country != null && country != undefined) {
					document.getElementById('r11').innerHTML = 'id: ';
					document.getElementById('r12').innerHTML = feature.getId();
					document.getElementById('r21').innerHTML = 'avg_pledged: ';
					document.getElementById('r22').innerHTML = country['avg_pledged'];}
				else {
					console.log("n0Data");
					document.getElementById('noData').innerHTML='[no Data]';
				}
			},{hitTolerance: 1});

			overlay.setPosition(e.coordinate);

		});
		function resetMarkup() {
			let el= document.querySelectorAll('.rst');
			el.forEach(e => e.innerHTML='');

		}
		function addPieChart(properties){
			console.log(properties)
		}


	}
}













