import {countryObject, dataList, max, getValueList, avg} from './DataManager';
import Overlay from 'ol/overlay';
import * as d3 from 'd3';
import * as scale from 'd3-scale';
import Linebarchart from "./linebarchart";
import PieChart from "./Piechart";
export default class Popup {
	constructor(map) {
		let olMap = map,
			countries = countryObject(),
			countryList = dataList(),
			width = 400,
			height = 400,
			total_projects = totalprojects(countryList),
			dataset = [
				{label: "mice", count: 5000},
				{label: "cats", count: 2222},
				{label: "dogs", count: 4000}
				],
			data3 =[
				{label:"green", count:56},
				{label:"blue", count:178},
				{label:"yellow", count:500},
				{label:"cyan", count:566},
				{label:"pink", count:990},
			],
			colors = ['green', 'purple', 'yellow'],
			global_max_pledged = max("avg_pledged"),
			global_avg_pledged = avg("avg_pledged"),
			global_max_goal = max('avg_goal'),
			global_avg_goal  =avg('avg_goal');


		const overlay = new Overlay({
			element: document.getElementById('popup-container'),
			positioning: 'bottom-center',
			offset: [0, -10],
			autoPan: true
		});

		olMap.addOverlay(overlay);
		olMap.on('click', function (e) {
			var feature =olMap.forEachFeatureAtPixel(e.pixel, function (feature) {
				const country = countries[feature.getId()];
				const properties = feature.getProperties();
				resetMarkup();
				console.log("properties: ", properties);
				var name = properties['name'];
				document.getElementById('header').innerHTML = name;
				var projects,
					states,
					global_goal;
				//will be called if user clicked on Country with data
				if (country != null && country != undefined) {
					var count= country['projects_count'];
					projects= [
						{label:'projects in '+feature.getId(), count: count},
						{label:'part of total', count: total_projects-count}
					];

					states = [
						{label: "canceled", count: country['states']['canceled']},
						{label: "successful", count: country['states']['successful']},
						{label: "failed",count:country['states']['failed']},
						{label:"suspended", count:country['states']['canceled']}
					];

					//create Charts from data here
					new PieChart(projects);
					new PieChart(states);
					new Linebarchart(global_avg_pledged, country['avg_pledged'], global_max_pledged, 200, 100);
					new Linebarchart(global_avg_goal, country['avg_goal'], global_max_goal, 200,100);

					overlay.setPosition(e.coordinate);}

				//will be called if there is no data for that particular country
					else {
					console.log("n0Data");
					document.getElementById('noData').innerHTML='[no Data]';
					overlay.setPosition();

				}


				return feature;
			},{hitTolerance: 1});




			document.getElementById('header').addEventListener('click', function() {
				overlay.setPosition();
			});

			//if no country is clicked popup will close
			if (feature==undefined){overlay.setPosition()}

		});




		function closePopup(overlay){
			console.log("worked");
			overlay.setPosition()
		}

		function resetMarkup() {
			let el= document.querySelectorAll('.rst');
			el.forEach(e => e.innerHTML='');

		}



	function totalprojects(countries) {
			var total = 0;
			countries.forEach(function (country){
				total+=Number(country['projects_count']);
			});
		return total;
		}





	}}













