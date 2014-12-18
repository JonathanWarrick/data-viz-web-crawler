// React Code

var Chart = React.createClass({
	propTypes: {
		data: React.PropTypes.array,
		width: React.PropTypes.number,
		height: React.PropTypes.number,
		margin: React.PropTypes.object
	},
	componentWillMount: function() {
		this.setProps({
			width: this.props.width - this.props.margin.left - this.props.margin.right,
			height: this.props.height - this.props.margin.top - this.props.margin.bottom
		});
	},
	componentDidMount: function() {
		console.log(this.state);
		var el = this.getDOMNode();
		d3Chart.create(el, this.props, this.state)
	},
	componentDidUpdate: function() {
		var el = this.getDOMNode();
		d3Chart.update(el, this.props, this.state);
	},
	render: function() {
    return (
      <div className="Chart"></div>
    );
  }
});

var App = React.createClass({
	getInitialState: function() {
		return {
			data: sampleData,
			domain: {
				x: this.data.map(function(d, i) {
					return i;
				}),
				y: [Math.min(0, Math.min.apply(null, this.data)), Math.max.apply(null, this.data)]
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