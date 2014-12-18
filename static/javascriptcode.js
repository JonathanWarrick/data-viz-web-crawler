var chartInstance = (function() {
  var instanceDataset;
  var margin;
  var width;
  var height;
  var padding;
  var xAxisLabel;
  var xScale;
  var yScale;
  var chart;

  return {
    initialize: function(dataset) {
      // create our dimensions, canvas, etc.
      margin = {
        top: 20,
        right: 30,
        left: 30,
        bottom: 40
      };
      width = 960 - margin.left - margin.right;
      height = 500 - margin.top - margin.bottom;
      padding = 2;

      instanceDataset = dataset;
      var currentDataset = dataset[0].scores;
      var barWidth = width / currentDataset.length;

      xAxisLabel = currentDataset.map(function(datapoint, index) {
        return index;
      });

      // create yScale to scale y-axis properly
      yScale = d3.scale.linear()
        .domain([0, d3.max(currentDataset)])
        .range([height, 0]);

      // create xScale to scale x-axis with values
      xScale = d3.scale.ordinal()
          .domain(xAxisLabel)
          .rangeRoundBands([0, width], .1);

      var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom');

      var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left')
        .ticks(10)

      chart = d3.select('.chart')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      chart.selectAll('.bar')
        .data(currentDataset)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', function(d, i) {
          return xScale(i);
        })
        .attr('y', function(d) {
          return yScale(d);
        })
        .attr('height', function(d) {
          return height - yScale(d);
        })
        .attr('width', xScale.rangeBand())
        .attr('fill', 'green')
        .on('mouseover', function (d) {
          d3.select(this).classed('active', true);
        })
        .on('mouseout', function (d) {
          d3.select(this).classed('active', false);
        });

      chart.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);

      chart.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
        .append('text')
        .attr('y', 6)
        .style('text-anchor', 'end')
        .text('Frequency');
    },
    testUpdate: function(datasetIndex) {
      chart.selectAll('.bar')
        .data(instanceDataset[datasetIndex].scores)
        .transition()
        .attr('x', function(d, i) {
          return xScale(i);
        })
        .attr('y', function(d) {
          return yScale(d);
        })
        .attr('height', function(d) {
          return height - yScale(d);
        })
        .attr('width', xScale.rangeBand());
    }
  };
})();