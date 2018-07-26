import * as d3 from 'd3';

const roundToDigit = (num, digit) => Math.round(num * Math.pow(10, digit)) / Math.pow(10, digit);

const reverseFloor = (num, restDigit) => roundToDigit(num, -(String(Math.floor(num)).length - restDigit));

const rangeValues = scale => {
	const [min, max] = scale.domain(),
		l = (max - min) / scale.range().length;
	return scale.range().map((color, i) => ({color: color, value: i * l}));
};

const isFirstOfList = (e, list) => e === list[0];

const isLastOfList = (e, list) => e === list[list.length - 1];

const getPrefix = (e, list) => isFirstOfList(e, list) ? "≤" : isLastOfList(e, list) ? "≥" : " ";

const addNumberSpaces = number => String(number).replace(/\d{3}$/, ' $&');

const createLegend = (colorValues, unit) => {
	const textHeightRaw = "1",
		textHeightUnit = "em",
		getTextHeight = () => String(textHeightRaw) + textHeightUnit,
		svg = document.createElementNS(d3.namespaces.svg, 'svg'),
		groupSelection = d3.select(svg)
			.attr("width", "8em")
			.selectAll("div")
			.data(colorValues)
			.enter()
			.append("g")
			.style("transform", (_, i) => `translate(0,${i * textHeightRaw}${textHeightUnit})`);

	groupSelection.append("rect")
		.attr("width", getTextHeight())
		.attr("height", getTextHeight())
		.style("fill", d => d.color);

	groupSelection.append("text")
		.text((d) => `${getPrefix(d, colorValues)} ${addNumberSpaces(d.value)} ${unit}`)
		.attr("y", getTextHeight())
		.attr("x", getTextHeight());


	return svg;
};

export const legendFromScale = (scale, unit) => {
	const colorValues = rangeValues(scale),
		roundedValues = colorValues.map(cv => ({
			...cv,
			'value': reverseFloor(cv['value'], 2),
		}));
	return createLegend(roundedValues, unit);
};
