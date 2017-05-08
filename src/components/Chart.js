var d3Chart = require('./d3Chart_v3');
var ReactDOM = require('react-dom');
var React = require('react')

var Chart = React.createClass({
  propTypes: {
    data: React.PropTypes.array,
    domain: React.PropTypes.object
  },

  componentDidMount: function() {
    var el = ReactDOM.findDOMNode(this);
    // console.log(this.props.selectedCat)
    var config = {
      width: el.offsetWidth-10,
      total_rows: this.props.rawdata.length,
      no_of_columns: 17,
      squareLength: function() {return this.width / this.no_of_columns}
    }

    // console.log(config.total_rows)

    d3Chart.create(el, {
      width: config.width,
      height: config.squareLength() * Math.ceil(config.total_rows/config.no_of_columns)
    }, this.getChartState(), config, this.props.selectedCat, this.props.callback);
  },

  componentDidUpdate: function() {
    var el = ReactDOM.findDOMNode(this);
    d3Chart.update(el, this.getChartState());
  },

  getChartState: function() {
    // console.log("myState", this.props)
    return {
      rawdata: this.props.rawdata,
      data: this.props.data,
      domain: this.props.domain
    };
  },

  componentWillUnmount: function() {
    var el = ReactDOM.findDOMNode(this);
    d3Chart.destroy(el);
  },

  render: function() {
    return (
      <div className="Chart"></div>
    );
  }
});

module.exports = Chart;