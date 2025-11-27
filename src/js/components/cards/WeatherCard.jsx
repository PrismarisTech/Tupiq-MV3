/**
 * Libs
 */
var React = require('react');
var classNames = require('classnames');
var moment = require('moment');

/**
 * WeatherCard
 */
var WeatherCard = React.createClass({
	render: function () {
		var unitClassName,
			message;

		var cardClassName = classNames({
			'card weather': true
		});

		var forecasts = (this.props.forecast !== null) ? this.props.forecast.forecasts.slice(0, 3) : null;

		if (forecasts !== null && forecasts.length > 0) {
			var firstForecast = moment(forecasts[0].item.forecast.date, 'D MMM YYYY');

			if (firstForecast.isSame(moment(), 'day')) {
				forecasts[0].item.forecast.day = 'Today';
			}

			return (
				<div className={cardClassName}>
					<ul>
						{forecasts.map(function (forecast) {
							var units = forecast.units;

							forecast = forecast.item.forecast;

							unitClassName = (units.temperature.toLowerCase() === 'c') ? 'wi wi-celsius' : 'wi wi-fahrenheit';

							// <span className="summary">{forecast.text}</span>

							return (
								<li key={forecast.date.replace(' ', '')} data-tooltip={forecast.text}>
									<img
										src={'icons/weather icons/' + forecast.code + '.png'}
										className="icon"
										alt={forecast.text}
									/>

									<span className="wrap">
										<span className="day">
											{forecast.day}
										</span>
										<span className="temp">
											{forecast.low}/{forecast.high}
											<i className={unitClassName}></i>
										</span>
									</span>
								</li>
							);
						})}
					</ul>
				</div>
			)
		} else {
			message = (this.props.isRefreshing === true) ? 'Fetching your local forecast...' : '';

			if (this.props.error !== null) {
				message = "Couldn't retrieve forecast.";
			}

			return (
				<div className={cardClassName}>
					<p className="weather__message">{message}</p>
				</div>
			)
		}
	}
});

module.exports = WeatherCard;
