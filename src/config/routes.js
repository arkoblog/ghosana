var React = require('react');
var ReactRouter = require('react-router');

var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;
var hashHistory = ReactRouter.hashHistory;

var Home = require('../components/Home');

var routes = (
    <Router history={hashHistory}>
		<Route path='/' component = {Home}>
		</Route>
	</Router>
);

module.exports = routes;
