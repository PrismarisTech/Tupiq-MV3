var React = require('react');
var TupiqActions = require('../../actions/TupiqActions');
var classNames = require('classnames');

var SettingsCard = React.createClass({
    toggleSetting: function (settingName) {
        TupiqActions.toggleSetting(settingName);
    },

    setTempUnit: function (unit) {
        TupiqActions.setTempUnit(unit);
    },

    render: function () {
        var settings = this.props.settings;

        // Animation delay for each item
        var getStyle = function (index) {
            return {
                animationDelay: (index * 0.1) + 's'
            };
        };

        return (
            <div className="card settings-card">
                <div className="settings-column">
                    <h3>Display</h3>
                    <div className="setting-item fade-in" style={getStyle(1)}>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={!settings.optsHideCalendar}
                                onChange={this.toggleSetting.bind(this, 'optsHideCalendar')}
                            />
                            <span className="slider"></span>
                            <span className="label-text">Todo List</span>
                        </label>
                    </div>
                    <div className="setting-item fade-in" style={getStyle(2)}>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={!settings.optsHideWeather}
                                onChange={this.toggleSetting.bind(this, 'optsHideWeather')}
                            />
                            <span className="slider"></span>
                            <span className="label-text">Weather</span>
                        </label>
                    </div>
                    <div className="setting-item fade-in" style={getStyle(3)}>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={!settings.optsHideTopSites}
                                onChange={this.toggleSetting.bind(this, 'optsHideTopSites')}
                            />
                            <span className="slider"></span>
                            <span className="label-text">Top Sites</span>
                        </label>
                    </div>
                </div>

                <div className="settings-column">
                    <h3>Weather Unit</h3>
                    <div className="setting-item fade-in" style={getStyle(4)}>
                        <div className="temp-switch">
                            <button
                                className={classNames({ active: settings.optsTempUnit === 'celcius' })}
                                onClick={this.setTempUnit.bind(this, 'celcius')}
                                dangerouslySetInnerHTML={{ __html: '&deg;C' }}
                            />
                            <button
                                className={classNames({ active: settings.optsTempUnit === 'fahrenheit' })}
                                onClick={this.setTempUnit.bind(this, 'fahrenheit')}
                                dangerouslySetInnerHTML={{ __html: '&deg;F' }}
                            />
                            <button
                                className={classNames({ active: settings.optsTempUnit === '' })}
                                onClick={this.setTempUnit.bind(this, '')}
                            >
                                Auto
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = SettingsCard;
