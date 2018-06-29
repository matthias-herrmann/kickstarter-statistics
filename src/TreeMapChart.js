// https://bl.ocks.org/mbostock/4063582
import * as d3 from 'd3';
import data from './assets/officialKickstarterAggregated';

const svg = d3.select('svg');
const width = parseFloat(svg.attr('width'));
const height = parseFloat(svg.attr('height'));
const color = d3.scaleOrdinal(['#49c8c5',
	'#e57de2',
	'#58ca67',
	'#d499e4',
	'#93c23d',
	'#76a2f1',
	'#e3a438',
	'#53bae9',
	'#bab74f',
	'#aca5e7',
	'#78c388',
	'#ec8cae',
	'#cdb074',
	'#a3c9fe',
	'#ef8f6c']);
const format = d3.format(',d');

const sumByCount = (d) => d.children ? 0 : 1;
const sumByTotalDollars = (d) => d.totalDollars;
const sumBySize = (d) => d.size;

const treemap = d3.treemap()
	.tile(d3.treemapResquarify) // good for comparision, only changes node sizes - not positioning
	.size([width, height])
	.round(true)
	.paddingInner(1);

const root = d3.hierarchy(data)
	.eachBefore((d) => { d.data.id = d.data.name; })
	.sum(sumBySize)
	.sort((a, b) => b.height - a.height || b.value - a.value);

treemap(root);

// TODO: Pack into seperate functions
const cell = svg.selectAll('g')
	.data(root.leaves())
	.enter().append('g')
	.attr('transform', (d) => 'translate(' + d.x0 + ',' + d.y0 + ')');

cell.append('rect')
	.attr('id', (d) =>  d.data.id)
	.attr('width', (d) => d.x1 - d.x0)
	.attr('height', (d) => d.y1 - d.y0)
	.attr('fill', (d) => color(d.data.id));

cell.append('clipPath')
	.attr('id', (d) => 'clip-' + d.data.id)
	.append('use')
	.attr('xlink:href', (d) => '#' + d.data.id);

// text shown on tiles
cell.append('text')
	.attr('clip-path', (d) => 'url(#clip-' + d.data.id + ')') // clipping path restricts region in which paint can be applied
	.selectAll('tspan')
	.data((d) => d.data.name.split(/(?=[A-Z][^A-Z])/g))
	.enter().append('tspan') // within text element, text and font properties and the current position
	.attr('x', 4)			  // can be adjusted with absolute or relative coordinate values
	.attr('y', (d, i) => 13 + i * 10)
	.attr('fill', 'whitesmoke')
	.text((d) => d);

cell.append('title') // Getting displayed on hover
	.text((d) => d.data.id + '\n' + format(d.value));

d3.selectAll('input')
	.data([sumBySize, sumByCount, sumByTotalDollars], function (d)  {
		return d ? d.name : this.value; // first time undefined, not working when using es6 anonymous => function syntax
	})
	.on('change', changed);

// initial selection with nice animation,
// should be triggered when in view for the first time
const timeout = d3.timeout(() => {
	d3.select('input[value="sumByTotalDollars"]')
		.property('checked', true)
		.dispatch('change');
}, 2000);

function changed(sum) { // function object: e.g. sumByCount, sumBySize, sumByTotalDollars
	timeout.stop();
	treemap(root.sum(sum));
	cell.transition()
		.duration(750)
		.attr('transform', (d) => 'translate(' + d.x0 + ',' + d.y0 + ')')
		.select('rect')
		.attr('width', (d) => d.x1 - d.x0)
		.attr('height', (d) => d.y1 - d.y0);
}