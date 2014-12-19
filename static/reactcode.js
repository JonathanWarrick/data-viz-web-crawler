// React Code

// var d3Chart = require('./d3code');

var Chart = React.createClass({
  propTypes: {
    data: React.PropTypes.array,
    domain: React.PropTypes.object,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    margin: React.PropTypes.object
  },
  componentWillMount: function() {
    console.log('before will mount', this.props.width);
    this.props.width = this.props.width - this.props.margin.left - this.props.margin.right;
    this.props.height = this.props.height - this.props.margin.top - this.props.margin.bottom;
    console.log('after will mount', this.props.width);
  },
  componentDidMount: function() {
    var el = this.getDOMNode();
    d3Chart.create(el, this.props);
    console.log('did mount', this.props.width);
  },
  componentDidUpdate: function() {
    this.props.width = this.props.width - this.props.margin.left - this.props.margin.right;
    this.props.height = this.props.height - this.props.margin.top - this.props.margin.bottom;
    var el = this.getDOMNode();
    d3Chart.update(el, this.props);
  },
  render: function() {
    return (
      <div className="Chart"></div>
    );
  }
});

var Selector = React.createClass({
  handleChange: function(e) {
    e.preventDefault();
    this.props.onSelectChange(e.target.selectedIndex);
  },
  render: function() {
    return (
      <div>
        <select name="option" width="300px" onChange={this.handleChange}>
          {this.props.data.map(function(datapoint) {
            return (
              <option name={datapoint}>
                {datapoint}
              </option>
            );
          })}
        </select>
      </div>
    );
  }
});

var App = React.createClass({
  handleSelectChange: function(selectIndex) {
    // debugger;
    var newIndex = selectIndex;
    this.setState({
      selectedIndex: newIndex,
      domain: {
        x: this.props.data[newIndex].scores.map(function(d, i) {
          return i;
        }),
        y: [newIndex, Math.max.apply(null, this.props.data[newIndex].scores)]
      }
    }, function() {
      this.render();
    });
  },
  getInitialState: function() {
    return {
      selectedIndex: 0,
      domain: {
        x: this.props.data[0].scores.map(function(d, i) {
          return i;
        }),
        y: [0, Math.max.apply(null, this.props.data[0].scores)]
      }
    };
  },
  render: function() {
    var marginObj = {
      top: 20,
      right: 30,
      left: 30,
      bottom: 40
    };
    return (
      <div>
        <Chart data={this.props.data[this.state.selectedIndex].scores}
               domain={this.state.domain}
               width={960}
               height={500}
               margin={marginObj} 
        />
        <Selector data={this.props.teamNames} onSelectChange={this.handleSelectChange} />
      </div>
    );
  }
});

var initialize = function(dataset) {
  React.render(<App data={dataset} teamNames = {dataset.map(function(datapoint) { return datapoint.name; })} />, document.body);
}

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