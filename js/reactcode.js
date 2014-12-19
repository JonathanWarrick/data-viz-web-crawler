// React Code

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