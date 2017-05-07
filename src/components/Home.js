var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
var d3 = require('d3')

var Chart = require('./Chart');

var sampleData = [
  {id: '5fbmzmtc', x: 7, y: 41, z: 6},
  {id: 's4fsphwm', x: 11, y: 42, z: 9},  {id: '5fbmamtc', x: 17, y: 41, z: 6},
  {id: 's4f8phaswm', x: 21, y: 12, z: 9},  {id: '5fbm1mtc', x: 18, y: 41, z: 6},
  {id: 's4f8phwfdm', x: 9, y: 22, z: 9},
];

// Load Components

// var MyMap = require('./Maps')


var Home = React.createClass({
    getInitialState: function() {
        return {
          data: sampleData,
          domain: {x: [0, 30], y: [0, 100]}            
        }
    },
    componentWillMount: function() {
      this.loadRawData()
    },
    loadRawData: function() {
      d3.csv("src/data/Book2.csv", function(csv_data){
          console.log(csv_data)
          this.setState({
            rawData:csv_data
          })
      }.bind(this))
    },
    componentDidMount: function() {},
    render: function() {
        var fullWidth = 700
        return (
            <div>
            <h1> Hello! </h1>
          <div className="col-md-12">

                <Chart
            data={this.state.data}
            domain={this.state.domain} />    
          </div>
             </div>
        )
    }
})

module.exports = Home;
