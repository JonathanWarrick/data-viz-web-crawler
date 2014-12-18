// var chartInstance = (function() {
//   var instanceDataset;
//   var margin;
//   var width;
//   var height;
//   var padding;
//   var xAxisLabel;
//   var xScale;
//   var yScale;
//   var chart;

//   return {
//     initialize: function(dataset) {
//       // create our dimensions, canvas, etc.
//       margin = {
//         top: 20,
//         right: 30,
//         left: 30,
//         bottom: 40
//       };
//       width = 960 - margin.left - margin.right;
//       height = 500 - margin.top - margin.bottom;  

//       instanceDataset = dataset;
//       var currentDataset = dataset[0].scores;

//       xAxisLabel = currentDataset.map(function(datapoint, index) {
//         return index;
//       });

//       // create yScale to scale y-axis properly
//       yScale = d3.scale.linear()
//         .domain([0, d3.max(currentDataset)])
//         .range([height, 0]);

//       // create xScale to scale x-axis with values
//       xScale = d3.scale.ordinal()
//           .domain(xAxisLabel)
//           .rangeRoundBands([0, width], .1);

//       var xAxis = d3.svg.axis()
//         .scale(xScale)
//         .orient('bottom');

//       var yAxis = d3.svg.axis()
//         .scale(yScale)
//         .orient('left')
//         .ticks(10)

//       chart = d3.select('.chart')
//         .attr('width', width + margin.left + margin.right)
//         .attr('height', height + margin.top + margin.bottom)
//         .append('g')
//         .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

//       chart.selectAll('.bar')
//         .data(currentDataset)
//         .enter()
//         .append('rect')
//         .attr('class', 'bar')
//         .attr('x', function(d, i) {
//           return xScale(i);
//         })
//         .attr('y', function(d) {
//           return yScale(d);
//         })
//         .attr('height', function(d) {
//           return height - yScale(d);
//         })
//         .attr('width', xScale.rangeBand())
//         .attr('fill', 'green')
//         .on('mouseover', function (d) {
//           d3.select(this).classed('active', true);
//         })
//         .on('mouseout', function (d) {
//           d3.select(this).classed('active', false);
//         });

//       chart.append('g')
//         .attr('class', 'x axis')
//         .attr('transform', 'translate(0,' + height + ')')
//         .call(xAxis);

//       chart.append('g')
//         .attr('class', 'y axis')
//         .call(yAxis)
//         .append('text')
//         .attr('y', 6)
//         .style('text-anchor', 'end')
//         .text('Frequency');
//     },
//     updateChart: function(datasetIndex) {
//       console.log(instanceDataset[datasetIndex].scores)
//       chart.selectAll('.bar')
//         .data(instanceDataset[datasetIndex].scores)
//         .transition()
//         .attr('x', function(d, i) {
//           return xScale(i);
//         })
//         .attr('y', function(d) {
//           return yScale(d);
//         })
//         .attr('height', function(d) {
//           return height - yScale(d);
//         })
//         .attr('width', xScale.rangeBand());
//     }
//   };
// })();


// React Code

var Chart = React.createClass({
  propTypes: {
    data: React.PropTypes.array,
    width: React.PropTypes.number,
    height: React.PropTypes.number
    margin: React.PropTypes.object
  },
  componentDidMount: function() {
    var el = this.getDOMNode();
    d3Chart.create(el, this.props, this.state)
  },
  componentDidUpdate: function() {
    var el = this.getDOMNode();
    d3Chart.update(el, this.props, this.state);
  },
  render: function() {
    return (
      <div>
      </div>
    );
  }
});

var App = React.createClass({
  getInitialState: function() {
    return {
      data: this.props.data
      domain: {
        x: this.props.data.map(function(d, i) {
          return i;
        }),
        y: [Math.min(0, Math.min.apply(null, this.props.data)), Math.max.apply(null, this.props.data)]
      }
    };
  },
  render: function() {
    return (
      <div>
        <Chart data={this.state.data}
               domain={this.state.domain}
               width={960}
               height={500}
               margin={
                top: 20,
                right: 30,
                left: 30,
                bottom: 40
               } 
        />
      </div>
    );
  }
});

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

var initialize = function(dataset) {
  React.render(<App data=dataset />, document.body);
}