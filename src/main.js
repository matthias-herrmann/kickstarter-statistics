import './styles/stylesheet.scss';
import 'ol/ol.css';
import DataMap from './DataMap';
import P from './popupMain';
import './TreeMapChart';

const initMap = () => {
	const target = 'map',
		colors = ['#F4E4D8', '#EAC7B0', '#DFAC88', '#D48E5F', '#C97234', '#A15A28', '#79421B', '#4F290E', '#231003'],
		keyValues = {		// needs better name
			'avg_pledged': 'Pledged',
			'avg_goal': 'Goal',
			'projects_count': 'Project Count',
		},
		dataMap = new DataMap(target, colors, keyValues);
	return dataMap.getMap();
};

const init = () => {
	const olMap = initMap();
	new P(olMap);
};

init();
