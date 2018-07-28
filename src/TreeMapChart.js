// https://bl.ocks.org/mbostock/4063582
import * as d3 from 'd3';
import data from './assets/officialKickstarterAggregated';

const svg = d3.select('#treeSvg');
const width = innerWidth * 0.8; // numbers are relative to the viewport size
const height = innerHeight * 0.7;
svg.attr('width', width);
svg.attr('height', height);

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
const sumBySuccessfullDollars = (d) => d.successfullDollars;
const sumByUnsuccessfullDollars = (d) => d.unsuccessfullDollars;
const sumBySuccessfullProjects = (d) => d.successfullProjects;
const sumByUnsuccessfullProjects = (d) => d.unsuccessfullProjects;
const titleFromDataObject = (d) => d.data.id + '\n' + format(d.value);

const dollarFormattingFunction = (number) => `$${number}M`;
const projectsCountFormattingFunction = (number) => `${number} projects`;

const valueFormattingFunctions = {
	'sumByCount': projectsCountFormattingFunction,
	'sumByTotalDollars': dollarFormattingFunction,
	'sumBySuccessfullDollars': dollarFormattingFunction,
	'sumByUnsuccessfullDollars': dollarFormattingFunction,
	'sumBySuccessfullProjects': projectsCountFormattingFunction,
	'sumByUnsuccessfullProjects': projectsCountFormattingFunction
};

const inputSelection = d3.selectAll('.radio-group>input');

let treemap = d3.treemap()
	.tile(d3.treemapResquarify) // good for comparision, only changes node sizes - not positioning
	.size([width, height])
	.round(true)
	.paddingInner(1);

const getValueOfRadioButtonSelection = () => d3.selectAll('.radio-group>input:checked').node().getAttribute('value');

const calculateCenterOfTextInRectangle = (tspanNode) => {
	const rectangleNode = tspanNode.parentElement.previousSibling.previousSibling; // tspan is in text element and 2 nodes above is the rectangle
	const centerX = (rectangleNode.getAttribute('width') / 2) - (tspanNode.getComputedTextLength() / 2);
	const centerY = (rectangleNode.getAttribute('height') / 2) + (19 / 2); // 19 is the font-size in pixel
	return {
		centerX: centerX,
		centerY: centerY
	};
};

const hideUnhideTextsDependentOnSpace = () => {
	textOnTilesSelection.nodes()
		.forEach((textElement) => {
			if(!textFitsInRectangle(textElement)) {
				textElement.setAttribute('visibility', 'hidden');
			} else {
				textElement.setAttribute('visibility', 'visible');
			}
		});
};

const textFitsInRectangle = (textElement) => {
	const tspanChildren = textElement.childNodes;
	const rectangleNode = textElement.previousSibling.previousSibling; // text element's previous sibling has the rectangle node as previous sibling
	const rectangleWidth = rectangleNode.getAttribute('width');
	const rectangleHeight = rectangleNode.getAttribute('height');

	for(let i=0; i < tspanChildren.length; ++i) { // VIOLATION of no raw loops, but can't break forEach
		const tspan = tspanChildren[i];
		if(tspan.getComputedTextLength() > rectangleWidth || rectangleHeight < 40) {
			return false;
		}
	}
	return true;
};

const root = d3.hierarchy(data)
	.eachBefore((d) => {
		d.data.id = d.data.name;
	})
	.sum(sumByCount)
	.sort((a, b) => b.height - a.height || b.value - a.value);

treemap(root);

// TODO: Pack into seperate functions
const cell = svg.selectAll('g')
	.data(root.leaves())
	.enter().append('g')
	.attr('transform', (d) => 'translate(' + d.x0 + ',' + d.y0 + ')');

cell.append('rect')
	.attr('id', (d) => d.data.id)
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
	.enter()
	.append('tspan') // within text element, text and font properties and the current position
	.attr('fill', 'whitesmoke')
	.text((d) => d);

const textOnTilesSelection = cell.selectAll('text');

const getValueFormattingFunctionForCurrentSelection = () => {
	const valueOfRadioButtonSelection = getValueOfRadioButtonSelection();
	return valueFormattingFunctions[valueOfRadioButtonSelection];
};

textOnTilesSelection.append('tspan')
	.attr('fill', 'whitesmoke')
	.attr('isValue', true)
	.text((d) => {
	    const formatValue = getValueFormattingFunctionForCurrentSelection();
	    return formatValue(d.value);
	});

const updateValueTextInRectangle = () => {
	const formatValue = getValueFormattingFunctionForCurrentSelection();
	cell.selectAll('tspan[isValue="true"')
		.text((d) => formatValue(d.value));
};

const calculateYPositionOfTspanInRectangle = (tspan) => {
	const yCenter = calculateCenterOfTextInRectangle(tspan).centerY;
	const isCategoryName = !tspan.getAttribute('isValue'); // category name is being displayed over the absolute value
	return isCategoryName ? yCenter - 19 / 2 : yCenter + 19 / 2;
};

const positionTspanElementsInRectangle = () => {
	cell.selectAll('tspan')
		.attr('x', function () {
			return calculateCenterOfTextInRectangle(this).centerX;
		}) // center x and y. Not using Es6 function because of this context which is the tspan element.
		.attr('y', function () {
			return calculateYPositionOfTspanInRectangle(this);
		}); // TODO: save function in function object where selection is being passed as param - VIOLATION OF DRY
};

positionTspanElementsInRectangle();

cell.append('title') // Getting displayed on hover
	.text((d) => titleFromDataObject(d));

inputSelection.data([sumByCount, sumByTotalDollars, sumBySuccessfullDollars, sumByUnsuccessfullDollars, sumBySuccessfullProjects, sumByUnsuccessfullProjects], function (d) {
	return d ? d.name : this.value; // first time undefined, not working when using es6 anonymous => function syntax
})
	.on('change', changed);

hideUnhideTextsDependentOnSpace();

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
	cell.selectAll('title')
		.text(d => titleFromDataObject(d));

	updateValueTextInRectangle();
	let gTransition = cell.transition()
		.duration(750);

	gTransition.attr('transform', (d) => 'translate(' + d.x0 + ',' + d.y0 + ')')
		.selectAll('rect')
		.attr('width', (d) => d.x1 - d.x0)
		.attr('height', (d) => d.y1 - d.y0);

	// Help from: https://stackoverflow.com/a/51121537/5111904
	// Splitting the transition to center text during animation
	gTransition.selectAll('tspan')
		.tween('positioning', function () {
			let self = this;
			return function () {
			    hideUnhideTextsDependentOnSpace();
				d3.select(self)
					.attr('x', function () {
						return calculateCenterOfTextInRectangle(this).centerX;
					}) // VIOLATION OF DRY
					.attr('y', function () {
						return calculateYPositionOfTspanInRectangle(this);
					});
			};
		});
}

// rerender treemap after window resizing
// https://stackoverflow.com/a/31586943/5111904
const debounce = function (func, wait, immediate) {
	let timeout;
	return function () {
		let context = this, args = arguments;
		let later = function () {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		let callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

const reRenderAfterResizing = debounce((function () {
	const selectedElement = inputSelection.filter(function () {
		return this.checked;
	}).nodes()[0];
	const valueOfSelectedElement = selectedElement.getAttribute('value');
	treemap.size([innerWidth * 0.8, innerHeight * 0.7]);
	changed(eval(valueOfSelectedElement));
}), 250);

window.addEventListener('resize', reRenderAfterResizing);
