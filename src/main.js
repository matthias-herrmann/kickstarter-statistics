import './styles/stylesheet.scss';
import 'ol/ol.css';
import DataMap from './DataMap';
import P from './popupMain';
import './TreeMapChart';
import './RadarChart';
import './LaunchedAtBar';
import './MoreContentArrow';
import '@fortawesome/fontawesome-free/css/all.min.css';

const initMap = () => {
	const target = 'map',
		colors = DataMap.getMapColors(),
		keyValues = {
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
