// D3 Code

var d3Chart = {};

d3Chart.create = function(el, props) {
  var svg = d3.select(el).append('svg')
    .attr('class', 'd3')
    .attr('width', props.width + props.margin.left + props.margin.right)
    .attr('height', props.height + props.margin.top + props.margin.bottom);

  svg.append('g')
    .attr('class', 'd3-points')
    .attr('transform', 'translate(' + props.margin.left + ',' + props.margin.top + ')');

  var initialScales = this.scales(el, props);
  var initialAxes = this.axes(el, props, initialScales);

  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(' + props.margin.left + ',' + (props.margin.top + props.height) + ')')
    .call(initialAxes.x);

  svg.append('g')
    .attr('class', 'y axis')
    .attr('transform', 'translate(' + props.margin.left + ',' + props.margin.top + ')')
    .call(initialAxes.y)
    .append('text')
    .attr('y', 6)
    .style('text-anchor', 'end')
    .text('Frequency');

  this.update(el, props);
};

d3Chart.update = function(el, props) {
  // Re-compute the scales, render the data points
  var scales = this.scales(el, props);
  var axes = this.axes(el, props, scales);
  this.plotPoints(el, props, scales, axes);
};

d3Chart.scales = function(el, props) {
  console.log(props);
  var scales = {};

  scales.x = d3.scale.ordinal()
    .domain(props.domain.x)
    .rangeRoundBands([0, props.width], 0.1);

  scales.y = d3.scale.linear()
    .domain(props.domain.y)
    .range([props.height, 0]);

  return scales;
};

d3Chart.axes = function(el, props, scales) {
  var axes = {};

  axes.x = d3.svg.axis()
    .scale(scales.x)
    .orient('bottom');

  axes.y = d3.svg.axis()
    .scale(scales.y)
    .orient('left')

  return axes;
};

d3Chart.plotPoints = function(el, props, scales, axes) {
  var g = d3.select(el).selectAll('.d3-points');

  // DATA JOIN
  var dataPoint = g.selectAll('.d3-point')
    .data(props.data);

  // ENTER
  dataPoint.enter()
    .append('rect')
    .attr('class', 'd3-point');

  // UPDATE + ENTER
  dataPoint.transition()
  .attr('x', function(d, i) {
    return scales.x(i);
  })
  .attr('y', function(d) {
    return scales.y(d);
  })
  .attr('height', function(d) {
    return props.height - scales.y(d);
  })
  .attr('width', scales.x.rangeBand());

  // EXIT
  dataPoint.exit().remove();

  // UPDATE AXES
  g.selectAll('.x.axis')
    .call(axes.x);

  g.selectAll('.y.axis')
    .call(axes.y);
};