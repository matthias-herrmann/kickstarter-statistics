import * as d3 from "d3";

export default class Linebarchart{
	constructor (global_avg, country_avg, global_max, width, height){
	var width = width,
		height= height,
		margin= 35,
		text_offset = 15,
		circle_radius = 12,
		line_height = 32,
		rectheight= 12,
		line_offset = line_height/6;


	var lineData=[
		{"x":300, "y1":((height-line_height)/2)+line_offset, "y2": (height+line_height)/2, "length": line_height, "label": ""},//no Idea why this line is needed, lineBarChart ignores the first entry when making vertical lines
		{"x":calc_x(global_avg), "y1":((height-line_height)/2)+line_offset, "y2": ((height+line_height)/2)+line_offset, "length": line_height, "label":"global"},
		{"x":calc_x(country_avg), "y1":((height-line_height)/2)-line_offset, "y2": ((height+line_height)/2)-line_offset,  "length": line_height, "label": "country \n avg"}];

	var rectData= [
		{"x":calc_x(Math.min(global_avg, country_avg)),"y":(height-rectheight)/2,"width":Math.max(calc_x(global_avg)-calc_x(country_avg),calc_x(country_avg)- calc_x(global_avg)),"heigth":rectheight, "fillcolour":"green"}
	];
	var labelData = [
		{"x":lineData[1].x,"y":lineData[1].y2+text_offset, "label":"global avg"},
		{"x":lineData[2].x,"y":lineData[2].y1-text_offset,"label":"country avg"}
		];
	if (global_avg>country_avg){rectData[0].fillcolour = "red"}
	console.log(rectData);

	var svgContainer = d3.select("#chart").append("svg")
		.attr("width", width)
		.attr("height", height);

	var line = svgContainer.append("line")
		.attr("x1", margin)
		.attr("y1", height/2)
		.attr("x2", width-margin)
		.attr("y2", height/2)
		.attr("stroke-width",3)
		.attr("stroke", "white");


	var text = svgContainer
		.selectAll("text")
		.data(labelData)
		.enter()
		.append("text");
	console.log("text: ", text);

	var textLabels = text
		.attr("x", function(d) { return d.x; })
		.attr("y", function(d) { return d.y;})
		.text( function (d) { return d.label })
		.attr("font-family", "sans-serif")
		.attr("font-size", "12px")
		.attr("fill", "white");

		var rect = svgContainer
			.selectAll("rect")
			.data(rectData)
			.enter()
			.append("rect");

		var rectAttributes = rect
			.attr("x", function (d) {return d.x})
			.attr("y", function (d) {return d.y})
			.attr("width", function (d) {return d.width})
			.attr("height", function (d) {return d.heigth})
			.attr("fill",function (d) { return d.fillcolour});

	var lines = svgContainer
		.selectAll("line")
		.data(lineData)
		.enter()
		.append("line");

	var lineAttributes = lines
		.attr("x1", function (d) {return d.x;})
		.attr("y1", function (d) {return d.y1})
		.attr("x2", function (d) {return d.x;})
		.attr("y2", function (d) {return d.y2})
		.attr("stroke-width", 3)
		.attr("stroke", "white");



	function calc_x(value){
		return(value/global_max)*(width-margin*2)+margin}


}}