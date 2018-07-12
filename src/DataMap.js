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

//todo map legend

const correctDomain = (min, max, avg) => {
	const diffMin = Math.abs(avg - min),
		diffMax = Math.abs(avg - max),
		diff = diffMin < diffMax ? diffMin : diffMax;
	return [avg - diff, avg + diff];
};

const createColorScale = (key, colors) => {
	const min = db.min(key),
		avg = db.avg(key),
		max = db.max(key),
		domain = correctDomain(min, max, avg);
	return d3Scale.scaleQuantize()
		.domain(domain)
		.range(colors);
};

const getCountryColors = (colorScale, key) => {
	return db.countryToColors(country => colorScale(country[key]));
};

const createVectorStyleFunction = countryColors => feature => new Style({
	stroke: new Stroke({
		color: 'cornflowerblue',
		width: 1.5,
	}),
	fill: new Fill({
		color: countryColors[feature.id_] || 'white'
	})
});

const createNewVectorLayer = () => new Vector({
	source: new VectorSource({
		url: './assets/countries.geojson',
		format: new GeoJSONFormat(),
	}),
});

const drawNewMap = (target, layers) => new Map({
	layers: [
		layers,
	],
	target: 'map',
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

const setMapColors = (countryColors, layer) => {
	layer.setStyle(createVectorStyleFunction(countryColors));
};

const createButtonControls = (map, textKeys, colorRange, layer) => {
	const controlsContainer = document.createElement('div');
	controlsContainer.className = 'button-controls ol-unselectable';
	Object.keys(textKeys).forEach(key => {
		const container = document.createElement('div'),
			button = document.createElement('button');
		button.innerHTML = textKeys[key];
		button.addEventListener('click', () => updateMap(map, colorRange, layer, key));
		container.className = 'ol-control';
		container.appendChild(button);
		controlsContainer.appendChild(container);
	});
	return new Control({element: controlsContainer});
};


const addMapControls = (map, layer, colors, keyValues) => {
	map.addControl(createButtonControls(map, keyValues, colors, layer));
};

const setMapLegend = (map, scale) => {
	const legend = MapLegend.legendFromScale(scale),
		wrapper = document.createElement('div');
	wrapper.className = 'legend-control';
	wrapper.appendChild(legend);
	// todo remove old control
	map.addControl(new Control({element: wrapper}));
};

const updateMap = (map, colorRange, layer, key) => {
	const scale = createColorScale(key, colorRange),
		countryColors = getCountryColors(scale, key);
	setMapColors(countryColors, layer);
	setMapLegend(map, scale);
};

export const createDataMap = (target, colors, keyValues) => {
	const vecLayer = createNewVectorLayer(),
		map = drawNewMap(target, vecLayer),
		defaultKey = Object.keys(keyValues)[0];
	addMapControls(map, vecLayer, colors, keyValues);
	updateMap(map, colors, vecLayer, defaultKey);
	return map;
};
