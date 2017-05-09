var React = require('react');
var ReactRouter = require('react-router');
var Link = ReactRouter.Link;
var d3 = require('d3')
var dataHelpers = require('./dataHelpers')
var ReactTable = require('react-table').default;

import 'react-table/react-table.css'
require('../css/home.css')
var Chart = require('./Chart');

var sampleData = [
    { id: '5fbmzmtc', x: 7, y: 41, z: 6 },
    { id: 's4fsphwm', x: 11, y: 42, z: 9 }, { id: '5fbmamtc', x: 17, y: 41, z: 6 },
    { id: 's4f8phaswm', x: 21, y: 12, z: 9 }, { id: '5fbm1mtc', x: 18, y: 41, z: 6 },
    { id: 's4f8phwfdm', x: 9, y: 22, z: 9 },
];

// Load Components

// var MyMap = require('./Maps')

var Buttons = React.createClass({
  handleClick: function(cat){
    this.props.update(cat);
    // console.log("selectedCat", cat)
  },

  render : function() {
    
    return (
      <div>
        
    {this.props.categories.map(function(cat, i){
      return (
          <button key = {i} onClick={() => { this.handleClick(cat) }} className="btn btn-xs btn-link">{cat}</button>  
            // console.log(cat)
        )
      }.bind(this))}
      </div>
    )
  }
})

var Home = React.createClass({
    getInitialState: function() {
        return {
            data: sampleData,
            domain: { x: [0, 30], y: [0, 100] },
            isLoading: true,
            selectedCat: "none"
        }
    },
    componentWillMount: function() {
        this.loadRawData()
    },
    completeLoading: function() {
      this.setState({
        isLoading:false
      })
    },
    updateParams: function(cat){
      // console.log(cat)
      this.setState({
        isLoading:true,
        selectedCat: cat
      }, this.completeLoading)
    },
    filterCommitment: function(data,selectedCat){
      console.log(data, selectedCat)
      var filtered = data.filter(function(d){
        return d.category_1 === this.state.selectedCat;
      }.bind(this))
      console.log(filtered)
      if(this.state.selectedCat == "none") {
        return data
      }
      return filtered;
    },
    loadRawData: function() {
        d3.csv('https://raw.githubusercontent.com/arkoblog/ghosana/master/src/data/cpn_maoist2.csv')
            .row(function(d) {
                var keys = Object.keys(d)
                    // console.log("Current",d[keys[0]])
                    // console.log(d)
                var new_obj = {
                        commitment: d[keys[0]],
                        category_1: d[keys[1]],
                        category_2: d[keys[2]],
                        category_3: d[keys[3]],
                        category_4: d[keys[4]],
                        category_5: d[keys[5]],
                        policy: d[keys[6]],
                        source_heading: d[keys[7]],
                        time_specified: d[keys[8]],
                        pol_party: d[keys[9]]
                    }
                    // console.log(JSON.stringify(new_obj))
                return new_obj;
            }.bind(this)).get(function(error, rows) {
                if (error) {
                    console.error(error);
                    console.error(error.stack);
                } else {
                    var cpnm = rows.filter(function(d){
                        return d.pol_party == "CPNM "
                    })

                    var nc = rows.filter(function(d){
                        return d.pol_party == "NC"
                    })

                    var cpnuml = rows.filter(function(d){
                        return d.pol_party == "CPNUML"
                    })

                    // console.log("Data",);
                    this.setState({ rawData: {nc: nc, cpnm :cpnm, cpnuml:cpnuml}, isLoading: false, categories: dataHelpers.getUniqueKeys(rows, "category_1") });
                }
            }.bind(this))
    },
    componentDidMount: function() {
    },
    render: function() {
        if (this.state.isLoading == true) {
            return (
                <div>
                  <div className="col-md-12">
                  <h1> ghosana. </h1>
                  <p> an attempt to visualize election manifestos for the upcoming local government elections.</p>
                  <hr/>
                  </div>
                </div>
            )
        } else {
            return (
                <div>
                  <div className="col-md-12">
                  <h1> ghosana. </h1>
                  <p>an attempt to visualize election manifestos for the upcoming local government elections.</p>
                  <p className="disclaimer">DISCLAIMER: Please note that I've currently used dummy data for display in the charts.</p>
                  <hr/>
                  </div>
                  <div className="row col-md-12">
                  <div className="col-md-4">
                      <h4>Nepali Congress</h4>    
                      <Chart callback={this.updateParams} selectedCat={this.state.selectedCat} rawdata={this.state.rawData.nc} data={this.state.data} domain={this.state.domain} /> 
                  </div>
                  <div className="col-md-4">
                      <h4>CPN Maoist</h4>   
                      <Chart callback={this.updateParams} selectedCat={this.state.selectedCat} rawdata={this.state.rawData.cpnm} data={this.state.data} domain={this.state.domain} /> 
                  </div>
                  <div className="col-md-4">
                      <h4>CPN UML</h4>    
                      <Chart callback={this.updateParams} selectedCat={this.state.selectedCat} rawdata={this.state.rawData.cpnuml} data={this.state.data} domain={this.state.domain} /> 
                  </div>
                  </div>
                  <div className="row col-md-12">
                    <div className="col-md-4">
                      <ReactTable showPageSizeOptions= {false} showPageJump = {false} defaultPageSize = {5} data={this.filterCommitment(this.state.rawData.nc, this.state.selectedCat)} columns = {[{header:'Commitment', accessor:'commitment'}]} />
                    </div>
                    <div className="col-md-4">
                      <ReactTable showPageSizeOptions= {false} showPageJump = {false} defaultPageSize = {5} data={this.filterCommitment(this.state.rawData.cpnm, this.state.selectedCat)} columns = {[{header:'Commitment', accessor:'commitment'}]} />
                    </div>
                    <div className="col-md-4">
                      <ReactTable showPageSizeOptions= {false} showPageJump = {false} defaultPageSize = {5} data={this.filterCommitment(this.state.rawData.cpnuml, this.state.selectedCat)} columns = {[{header:'Commitment', accessor:'commitment'}]} />
                    </div>

                  </div>
                  <div className="col-md-12">
                  <h4>how to read the chart?</h4>
                  <p>Each individual grey box represents a commitment that was made by a political party in their manifesto. Commitments that fall under the same category have been packed together, and are represented by the same shade of grey.</p>
                  <p>You can hover over a box to learn more about the commitment.</p>                  
                  <p>When hovering over a box, all commitments that fall under the same category as that of the box will be highlighted in red color. You can click on the commitment to compare category specific commitments across all three parties.</p>

                  <hr/>
                  {/*<p>please begin by selecting a category:</p>
                                    <Buttons update = {this.updateParams}categories = {this.state.categories}/>*/}
                  </div>
                </div>
            )
        }

    }
})

module.exports = Home;
