// D3 Code

var d3Chart = {};

d3Chart.create = function(el, props, state) {
	var svg = d3.select(el).append('svg')
		.attr('class', 'd3')
		.attr('width', props.width - props.margin.left - props.margin.right)
		.attr('height', props.height - props.margin.top - props.margin.bottom);

	svg.append('g')
		.attr('class', 'd3-points')
		.attr('transform', 'translate(' + props.margin.left + ',' + props.margin.top + ')');

	this.update(el, props, state);
};

d3Chart.update = function(el, props, state) {
	// Re-compute the scales, render the data points
	var scales = this.scales(el, props, state);
	var axes = this.axes(el, props, state, scales);
	this.plotPoints(el, props, state, scales, axes);
};

d3Chart.scales = function(el, props, state) {
	var scales = {};

	scales.x = d3.scale.ordinal()
		.domain(state.domain.x)
		.rangeRoundBands([0, props.width], 0.1);

	scales.y = d3.scale.linear()
		.domain(state.domain.y)
		.range([props.height, 0]);

	return scales;
};

d3Chart.axes = function(el, props, state, scales) {
	var axes = {};

	axes.x = d3.svg.axis()
		.scale(scales.x)
		.orient('bottom');

	axes.y = d3.svg.axis()
		.scale(scales.y)
		.orient('left')

	return axes;
};

d3Chart.plotPoints = function(el, props, state, scales, axes) {
	var g = d3.select(el).selectAll('.d3-points');

	var dataPoint = g.selectAll('.d3-point')
		.data(state.data)
		.enter()
		.append('rect')
		.attr('class', 'd3-point');

	dataPoint.attr('x', function(d, i) {
		return scales.x(i);
	})
	.attr('y', function(d) {
		return scales.y(d);
	})
	.attr('height', function(d) {
		return props.height - scales.y(d);
	})
	.attr('width', scales.x.rangeBand());

	dataPoint.exit()
		.remove();
};