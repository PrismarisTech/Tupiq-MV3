/**
 * Libs
 */
var React = require('react');
var TupiqTools = require('../utils/TupiqTools');
var Analytics = require('../utils/Analytics');

/**
 * Pure component
 */
var TupiqStore = require('../stores/TupiqStore');
var TupiqBody = require('./TupiqBody');

var TupiqBodyContainer = React.createClass({
	getInitialState: function () {
		return {
			settings: TupiqStore.getSettings()
		};
	},

	componentDidMount: function () {
		TupiqStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function () {
		TupiqStore.removeChangeListener(this._onChange);
	},

	_onChange: function () {
		this.setState({
			settings: TupiqStore.getSettings()
		});
	},

	render: function () {
		return (
			<TupiqBody settings={this.state.settings} />
		)
	}
});

module.exports = TupiqBodyContainer;
