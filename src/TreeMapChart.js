// https://bl.ocks.org/mbostock/4063582
import * as d3 from 'd3';
import data from './assets/flare';

const svg = d3.select('svg');
const width = parseFloat(svg.attr('width'));
const height = parseFloat(svg.attr('height'));

const color = d3.scaleOrdinal(d3.schemeAccent);
const format = d3.format(',d');

const treemap = d3.treemap()
	.tile(d3.treemapResquarify)
	.size([width, height])
	.round(true)
	.paddingInner(1);

const root = d3.hierarchy(data)
	.eachBefore((d) => { d.data.id = (d.parent ? d.parent.data.id + '.' : '') + d.data.name; })
	.sum(sumBySize)
	.sort((a, b) => b.height - a.height || b.value - a.value);

treemap(root);

const cell = svg.selectAll('g')
	.data(root.leaves())
	.enter().append('g')
	.attr('transform', (d) => { return 'translate(' + d.x0 + ',' + d.y0 + ')'; });

cell.append('rect')
	.attr('id', (d) =>  d.data.id)
	.attr('width', (d) => d.x1 - d.x0)
	.attr('height', (d) => d.y1 - d.y0)
	.attr('fill', (d) => color(d.parent.data.id));

cell.append('clipPath')
	.attr('id', (d) => { return 'clip-' + d.data.id; })
	.append('use')
	.attr('xlink:href', (d) => { return '#' + d.data.id; });

cell.append('text')
	.attr('clip-path', (d) => { return 'url(#clip-' + d.data.id + ')'; })
	.selectAll('tspan')
	.data((d) => { return d.data.name.split(/(?=[A-Z][^A-Z])/g); })
	.enter().append('tspan')
	.attr('x', 4)
	.attr('y', (d, i) => { return 13 + i * 10; })
	.text((d) => { return d; });

cell.append('title')
	.text(function(d) { return d.data.id + '\n' + format(d.value); });

d3.selectAll('input')
	.data([sumBySize, sumByCount, sumByTotalDollars], function (d)  {
		return d ? d.name : this.value; // first time undefined, not working when using es6 anonymous => function syntax
	})
	.on('change', changed);

var timeout = d3.timeout(function() {
	d3.select('input[value="sumByCount"]')
		.property('checked', true)
		.dispatch('change');
	d3.select('input[value="sumByTotalDollars"]')
		.property('checked, true')
		.dispatch('change');
}, 2000);

function changed(sum) { // e.g. sumByCount, sumBySize, sumByTotalDollars
	timeout.stop();
	treemap(root.sum(sum));
	cell.transition()
		.duration(750)
		.attr('transform', (d) => 'translate(' + d.x0 + ',' + d.y0 + ')')
		.select('rect')
		.attr('width', (d) => d.x1 - d.x0)
		.attr('height', (d) => d.y1 - d.y0);
}

function sumByCount(d) {
	return d.children ? 0 : 1;
}

function sumByTotalDollars(d) {
	return d.totalDollars;
}

function sumBySize(d) {
	return d.size;
}