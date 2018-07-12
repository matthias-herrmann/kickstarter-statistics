import 'ol/ol.css';
import Map from 'ol/map';
import Vector from 'ol/layer/vector';
import VectorSource from 'ol/source/vector';
import GeoJSONFormat from 'ol/format/geojson';
import View from 'ol/view';
import proj from 'ol/proj';
import Style from 'ol/style/style';
import Stroke from 'ol/style/stroke';
import Fill from 'ol/style/fill';
import control from 'ol/control';
import Control from 'ol/control/control';
import * as db from './DataManager';
import * as d3Scale from 'd3-scale';
import * as MapLegend from './MapLegend';


export default class DataMap {

	constructor(target, colors, keyValues) {
		const defaultKey = Object.keys(keyValues)[0];
		this.colors = colors;
		this.vecLayer = DataMap.createNewVectorLayer();
		this.map = this.drawNewMap(target);

		this.addMapControls(keyValues);
		this.updateMap(defaultKey);
	}

	static correctDomain(min, max, avg) {
		const diffMin = Math.abs(avg - min),
			diffMax = Math.abs(avg - max),
			diff = diffMin < diffMax ? diffMin : diffMax;
		return [avg - diff, avg + diff];
	}

	static createColorScale(key, colors) {
		const min = db.min(key),
			avg = db.avg(key),
			max = db.max(key),
			domain = DataMap.correctDomain(min, max, avg);
		return d3Scale.scaleQuantize()
			.domain(domain)
			.range(colors);
	}

	static getCountryColors(colorScale, key) {
		return db.countryToColors(country => colorScale(country[key]));
	}

	static createVectorStyleFunction(countryColors) {
		return feature => new Style({
			stroke: new Stroke({
				color: 'cornflowerblue',
				width: 1.5,
			}),
			fill: new Fill({
				color: countryColors[feature.id_] || 'white'
			})
		});
	}

	static createNewVectorLayer() {
		return new Vector({
			source: new VectorSource({
				url: './assets/countries.geojson',
				format: new GeoJSONFormat(),
			}),
		});
	}

	getMap() {
		return this.map;
	}

	drawNewMap(target) {
		return new Map({
			layers: [
				this.vecLayer
			],
			target: target,
			view: new View({
				center: proj.fromLonLat([13.41, 52.52]), //Germany
				zoom: 4, //zoom constant
				maxZoom: 5,
				minZoom: 2,
				extent: [-10018254, -10018254, 10018254, 10018254],
			}),
			controls: control.defaults({
				rotate: false,
				attribution: false,
			}),
		});
	}

	setMapColors(countryColors) {
		this.vecLayer.setStyle(DataMap.createVectorStyleFunction(countryColors));
	}

	createButtonControl({key, text}) {
		const container = document.createElement('div'),
			button = document.createElement('button');
		button.innerHTML = text;
		button.addEventListener('click', () => this.updateMap(key));
		container.className = 'ol-control';
		container.appendChild(button);
		return container;
	}

	createButtonControls(keyValues) {
		const controlsContainer = document.createElement('div');
		controlsContainer.className = 'button-controls ol-unselectable';
		Object.keys(keyValues).forEach(key => {
			const button = this.createButtonControl({key: key, text: keyValues[key]});
			controlsContainer.appendChild(button);
		});
		return new Control({element: controlsContainer});
	}

	addMapControls(keyValues) {
		this.map.addControl(this.createButtonControls(keyValues));
	}

	setMapLegend(scale) {
		const legend = MapLegend.legendFromScale(scale),
			wrapper = document.createElement('div');
		wrapper.className = 'legend-control';
		wrapper.appendChild(legend);
		// todo remove old control
		this.map.addControl(new Control({element: wrapper}));
	}

	updateMap(key) {
		const scale = DataMap.createColorScale(key, this.colors),
			countryColors = DataMap.getCountryColors(scale, key);
		this.setMapColors(countryColors);
		this.setMapLegend(scale);	// todo add unit
	}

}

