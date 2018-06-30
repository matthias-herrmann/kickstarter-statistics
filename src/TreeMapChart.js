// https://bl.ocks.org/mbostock/4063582
import * as d3 from 'd3';
import data from './assets/officialKickstarterAggregated';

const svg = d3.select('svg');
const width = parseFloat(svg.attr('width'));
const height = parseFloat(svg.attr('height'));
const color = d3.scaleOrdinal(['#9f3857',
	'#01b92f',
	'#354ed4',
	'#cbae09',
	'#c38dff',
	'#c87800',
	'#006aa9',
	'#ae3b00',
	'#00c19b',
	'#ff557a',
	'#586222',
	'#b3a9dc',
	'#825044',
	'#f59688']);
const format = d3.format(',d');

const sumByCount = (d) => d.count;
const sumByTotalDollars = (d) => d.totalDollars;

const titleFromDataObject = (d) => d.data.id + '\n' + format(d.value);

const treemap = d3.treemap()
	.tile(d3.treemapResquarify) // good for comparision, only changes node sizes - not positioning
	.size([width, height])
	.round(true)
	.paddingInner(1);

const calculateCenterOfTextInRectangle = (tspanNode) => {
	const rectangleNode = tspanNode.parentElement.previousSibling.previousSibling; // tspan is in text element and 2 nodes above is the rectangle
	const centerX = (rectangleNode.getAttribute('width') / 2) - (tspanNode.getComputedTextLength() / 2);
	const centerY = (rectangleNode.getAttribute('height') / 2) + (19 / 2); // 19 is the font-size in pixel
	return {centerX: centerX,
		centerY: centerY};
};

const root = d3.hierarchy(data)
	.eachBefore((d) => { d.data.id = d.data.name; })
	.sum(sumByCount)
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
	.data((d) => d.data.name.split(/(?=[A-Z](\s|&)+[^A-Z])/g))
	.enter().append('tspan') // within text element, text and font properties and the current position
	.attr('fill', 'whitesmoke')
	.text((d) => d);

cell.selectAll('tspan')
	.attr('x', function() { return calculateCenterOfTextInRectangle(this).centerX; }) // center x and y. Not using Es6 function because of this context which is the tspan element.
	.attr('y', function() { return calculateCenterOfTextInRectangle(this).centerY; });

cell.append('title') // Getting displayed on hover
	.text((d) => titleFromDataObject(d));

d3.selectAll('input')
	.data([sumByCount, sumByTotalDollars], function (d)  {
		return d ? d.name : this.value; // first time undefined, not working when using es6 anonymous => function syntax
	})
	.on('change', changed);

// initial selection with nice animation,
// should be triggered when in view for the first time
const timeout = d3.timeout(() => {
	d3.select('input[value="sumByTotalDollars"]')
		.property('checked', true)
		.dispatch('change');
}, 10000);

function changed(sum) { // function object: e.g. sumByCount, sumBySize, sumByTotalDollars
	timeout.stop();

	const intervalId = setInterval(
		() => {
			cell.selectAll('tspan')
				.attr('x', function() { return calculateCenterOfTextInRectangle(this).centerX; }) // center x and y. Not using Es6 function because of this context which is the tspan element.
				.attr('y', function() { return calculateCenterOfTextInRectangle(this).centerY; });
		},
		0.03
	);

	treemap(root.sum(sum));
	cell.transition()
		.duration(750)
		.attr('transform', (d) => 'translate(' + d.x0 + ',' + d.y0 + ')')
		.selectAll('rect')
		.attr('width', (d) => d.x1 - d.x0)
		.attr('height', (d) => d.y1 - d.y0)
		.each('end', function() {intervalId.stop();});

	cell.selectAll('title')
		.text(d => titleFromDataObject(d));
}