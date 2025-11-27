/**
 * Libs
 */
var React = require('react');
var objectAssign = require('object-assign');
var classNames = require('classnames');
var PureMixin = require('react-pure-render/mixin');

/**
 * Child components
 */
var TupiqHeaderContainer = require('./TupiqHeaderContainer');
var TupiqBodyContainer = require('./TupiqBodyContainer');
var TupiqWelcomeContainer = require('./TupiqWelcomeContainer.react');
var SettingsCard = require('./cards/SettingsCard.jsx');

/**
 * Tupiq
 */
var Tupiq = React.createClass({
	mixins: [PureMixin],

	getInitialState: function () {
		return {
			isFlipped: false,
			hasInteracted: false
		};
	},

	componentDidMount: function () {
		// Must call this so positioning is set based
		// on dom node measurements.
		this.forceUpdate();
	},

	toggleFlip: function () {
		this.setState({
			isFlipped: !this.state.isFlipped,
			hasInteracted: true
		});
	},

	render: function () {
		var xPos = 0,
			yPos = 0,
			padding = 10,
			isMounted = this.isMounted();

		if (isMounted) {
			var element = this.getDOMNode(),
				elementWidth = element.offsetWidth,
				elementHeight = element.offsetHeight;

			// Calculate left and top based on percentage props
			xPos = padding + ((window.innerWidth - elementWidth - (padding * 2)) * this.props.coordinates.x);
			yPos = padding + ((window.innerHeight - elementHeight - (padding * 2)) * this.props.coordinates.y);
		}

		var style = this.props.isMinimised ? {} : {
			left: xPos,
			top: yPos
		};

		var tupiqClassName = classNames({
			'tupiq': true,
			'is-dragging': this.props.isDragging,
			'is-minimised': this.props.isMinimised,
			'hidden': !isMounted,
			'is-flipped': this.state.isFlipped,
			'has-interacted': this.state.hasInteracted
		});

		var gearIcon = (
			<svg viewBox="0 0 24 24"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" /></svg>
		);

		return (
			<div className={tupiqClassName} style={style}>
				<div className="tupiq__flipper">
					<div className="tupiq__front">
						<div className="tupiq__settings-toggle" onClick={this.toggleFlip}>
							{gearIcon}
						</div>
						<TupiqHeaderContainer onMouseDown={this.props.onMouseDown} />
						<TupiqBodyContainer />
						<TupiqWelcomeContainer />
					</div>
					<div className="tupiq__back">
						<div className="tupiq__settings-toggle" onClick={this.toggleFlip}>
							{gearIcon}
						</div>
						<SettingsCard settings={this.props.settings} />
					</div>
				</div>
			</div>
		)
	}
});

module.exports = Tupiq;
