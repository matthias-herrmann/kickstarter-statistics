import data from './assets/projectsLaunchedAtByHour';
import * as d3 from 'd3';

// https://bl.ocks.org/mbostock/3885304

var svg = d3.select('#barSvg'),
	margin = {top: 20, right: 20, bottom: 30, left: 70},
	width = +svg.attr('width') - margin.left - margin.right,
	height = +svg.attr('height') - margin.top - margin.bottom;

var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
	y = d3.scaleLinear().rangeRound([height, 0]);

var g = svg.append('g')
	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

x.domain(data.map(function(d) { return d['_id']; }));
y.domain([0, d3.max(data, function(d) { return d.count; })]);

g.append('g')
	.attr('class', 'axis axis--x')
	.attr('transform', 'translate(0,' + height + ')')
	.call(d3.axisBottom(x))
	.append('text')
	.attr('dy', '0.71em')
	.attr('y', 20)
	.attr('x', 850)
	.attr('text-anchor', 'end')
	.attr('stroke', 'black')
	.text('Launched At Hour In German Time (UTC+02:00)');

g.append('g')
	.attr('class', 'axis axis--y')
	.call(d3.axisLeft(y))
	.append('text')
	.attr('transform', 'rotate(-90)')
	.attr('y', 6)
	.attr('dy', '0.71em')
	.attr('text-anchor', 'end')
	.attr('stroke', 'black')
	.text('Projects');

g.selectAll('.bar')
	.data(data)
	.enter().append('rect')
	.attr('class', 'bar')
	.attr('fill', 'royalblue')
	.attr('x', function(d) { return x(d['_id']); })
	.attr('y', function(d) { return y(d.count); })
	.attr('width', x.bandwidth())
	.attr('height', function(d) { return height - y(d.count); });
