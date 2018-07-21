import * as d3 from "d3";
export default class PieChart{
	constructor(data){
	var width = Math.max(data.length*30,200);
	var height = width;
	var radius = Math.min(width, height) / 2;
	var color = d3.scaleOrdinal().range(['#A60F2B', '#648C85', '#B3F2C9', '#528C18', '#C3F25C']);
	var svg = d3.select('#chart')
		.append('svg')
		.attr('width', width)
		.attr('height', height)
		.append('g')
		.attr('transform', 'translate(' + (width / 2) +  ',' + (height / 2) + ')');
	var arc = d3.arc()
		.innerRadius(radius/1.5)
		.outerRadius(radius);
	var pie = d3.pie()
		.value(function(d) { return d.count; })
		.sort(null);

	var path = svg.selectAll('path')
		.data(pie(data))
		.enter()
		.append('path')
		.attr('d', arc)
		.attr('fill', function(d, i) {return color(d.data.label);})
		.each(function(d) { this._current = d; });

	var legend = addLegend(data, svg, color, width, path, pie, arc);
	addToolTip(data, path);
	addAnimation(path,legend, pie, arc, data);

	data.forEach(function (d) {
		d.enabled=true;
	})



function addLegend(data, svg, color, size){
	var legendRectSize = Math.max(size/30, 8);
	var legendSpacing= Math.max(size/60, 4);
	var fontSize = legendRectSize*1.5;
	var legend = svg.selectAll('.legend')
		.data(color.domain())
		.enter()
		.append('g')
		.attr('class','legend')
		.attr('transform', function(d,i){
			var height = legendRectSize + legendSpacing;
			var offset = height * color.domain().length/2;
			var horizontalOffset=-7;//moves legend to left if negative, to the right if positive
			var horz = -7 * legendRectSize;
			var vert = i*height-offset;
			return 'translate(' + horz + ', '+ vert + ')';
		});
	legend.append('rect')
		.attr('width', legendRectSize)
		.attr('height', legendRectSize)
		.style('fill', color)
		.style('stroke', color)
		.attr('class', 'enabled');
	legend.append('text')
		.style("font-size", Math.max(fontSize,11) +"px")
		.attr('x', legendRectSize + legendSpacing)
		.attr('y', legendRectSize - legendSpacing+3)
		.text(function(d) { return d; })
		.style('fill', 'white');

	return legend;
}

function addToolTip(data, path) {
	var tooltip = d3.select('#chart')
		.append('div')
		.attr('class', 'tooltip');

	tooltip
		.append('div')
		.attr('class', 'label');

	tooltip
		.append('div')
		.attr('class', 'count');

	tooltip
		.append('div')
		.attr('class', 'percent');


	path.on('mouseover', function (d) {
		var total = d3.sum(data.map(function(d) {
			return (d.enabled) ? d.count : 0;
		}));
		var total = d3.sum(data.map(function (d) {
			return d.count;
		}));
		var percent = Math.round(1000 * d.data.count / total) / 10;
		tooltip.select('.label').html(d.data.label);
		tooltip.select('.count').html(d.data.count);
		tooltip.select('.percent').html(percent + '%');
		tooltip.style('display', 'block');
	});

	path.on('mouseout', function() {
		tooltip.style('display', 'none');
	});

	path.on('mousemove', function(d) {
		tooltip.style('top', (d3.event.layerY + 10) + 'px')
			.style('left', (d3.event.layerX + 10) + 'px');
	});

}

function addAnimation(path, legend, pie, arc, data){
	legend.on('click', function(label){

		var rect = d3.select(this);
		var enabled = true;
		var totalEnabled = d3.sum(data.map(function(d) {
			return (d.enabled) ? 1 : 0;
		}));

		if (rect.attr('class') === 'disabled') {
			rect.attr('class', 'enabled');
			console.log(rect.attr('class'));
		} else {
			if (totalEnabled < 2) return;
			rect.attr('class', 'disabled');
			rect.attr('width',300);
			enabled = false;
		}

		pie.value(function(d) {
			if (d.label === label) d.enabled = enabled;
			return (d.enabled) ? d.count : 0;
		});

		path = path.data(pie(data));

		path.transition()
			.duration(750)
			.attrTween('d', function(d) {
				var interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function(t) {
					return arc(interpolate(t));
				};
			});
	});
	path
		.transition()
		//.delay(function(d,i) {return i * 500; })
		.duration(1100)
		.attrTween('d', function(d) {var i = d3.interpolate(d.startAngle+0.1, d.endAngle);  return function(t) {d.endAngle = i(t);return arc(d)}})
}}}