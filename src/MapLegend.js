import * as d3 from 'd3';

const rangeValues = scale => {
	const {range, ticks} = scale,
		length = range().length < ticks().length ? range().length : ticks().length;
	let result = [];

	for (let i = 0; i < length; i++)
		result.push({color: range()[i], value: ticks()[i]});
	return result;
};

const isFirstOfList = (e, list) => e === list[0];

const isLastOfList = (e, list) => e === list[list.length - 1];

const getPrefix = (e, list) => isFirstOfList(e, list) ? '≤' : isLastOfList(e, list) ? '≥' : ' ';

const addNumberSpaces = number => String(number).replace(/\d{3}$/, ' $&');

const createLegend = (colorValues, unit) => {
	const textHeightRaw = 1,
		textHeightUnit = 'em',
		verticalSpace = 0.1,
		getTextHeight = () => String(textHeightRaw) + textHeightUnit,
		svg = document.createElementNS(d3.namespaces.svg, 'svg'),
		groupSelection = d3.select(svg)
			.attr('width', '10.5em')
			.selectAll('div')
			.data(colorValues)
			.enter()
			.append('g')
			.style('transform', (_, i) => `translate(0,${i * (textHeightRaw + verticalSpace)}${textHeightUnit})`);

	groupSelection.append('rect')
		.attr('width', getTextHeight())
		.attr('height', getTextHeight())
		.style('fill', d => d.color);

	groupSelection.append('text')
		.text((d) => `${getPrefix(d, colorValues)} ${addNumberSpaces(d.value)} ${unit}`)
		.attr('y', getTextHeight())
		.attr('x', `${String(textHeightRaw + 0.5)}${textHeightUnit}`);

	return svg;
};

export const legendFromScale = (scale, unit) => {
	const colorValues = rangeValues(scale);
	return createLegend(colorValues, unit);
};
