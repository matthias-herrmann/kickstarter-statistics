import './styles/stylesheet.scss';
import 'ol/ol.css';
import * as DataMap from './DataMap';
import P from './popupMain';

const setMapColors = (colors, key, layer) => {
	const countryColors = DataMap.calcMapColors(key, colors);
	DataMap.setMapColors(countryColors, layer);
};

const addMapControls = (map, layer, colors) => {
	map.addControl(DataMap.createButtonControls({
		'avg_pledged': 'Pledged avg',
		'median_pledged': 'Pledged median',
		'avg_goal': 'Goal avg',
		'median_goal': 'Goal median',
		'projects_count': 'Count',
	}, colors, layer));
};

const initMap = () => {
	const target = 'map',
		colors = ['#F4E4D8', '#EAC7B0', '#DFAC88', '#D48E5F', '#C97234', '#A15A28', '#79421B', '#4F290E', '#231003'],
		vecLayer = DataMap.createNewVectorLayer(),
		map = DataMap.drawNewMap(target, vecLayer);
	addMapControls(map, vecLayer, colors);
	setMapColors(colors, 'avg_pledged', vecLayer);
	return map;
};

const init = () => {
	const olMap = initMap();
	new P(olMap);
};

init();