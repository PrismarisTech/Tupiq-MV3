/**
 * Libs
 */
var React = require('react');
var classNames = require('classnames');

/**
 * Child components
 */
var WeatherCardContainer = require('./cards/WeatherCardContainer.jsx');
var TodoCardContainer = require('./cards/TodoCardContainer.jsx');
var TopSitesCardContainer = require('./cards/TopSitesCardContainer.jsx');

/**
 * TupiqBody
 */
var TupiqBody = React.createClass({
  render: function () {
    var tupiqBodyClass = classNames({
      'tupiq__body': true
    });

    return (
      <div className={tupiqBodyClass}>
        {this.props.settings.optsHideCalendar ? null : <TodoCardContainer />}
        {this.props.settings.optsHideWeather ? null : <WeatherCardContainer />}
        {this.props.settings.optsHideTopSites ? null : <TopSitesCardContainer />}
      </div>
    )
  }
});

module.exports = TupiqBody;
