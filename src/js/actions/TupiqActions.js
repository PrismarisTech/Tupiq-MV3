var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');

var TupiqActions = {
  startDrag: function (dragOriginData) {
    AppDispatcher.dispatch({
      actionType: AppConstants.TUPIQ_DRAG_START,
      dragOriginData: dragOriginData
    });
  },

  stopDrag: function () {
    AppDispatcher.dispatch({
      actionType: AppConstants.TUPIQ_DRAG_STOP
    });
  },

  reposition: function (coordinates) {
    AppDispatcher.dispatch({
      actionType: AppConstants.TUPIQ_REPOSITION,
      coordinates: coordinates
    });
  },

  minimise: function () {
    AppDispatcher.dispatch({
      actionType: AppConstants.TUPIQ_MINIMISE
    });
  },

  toggleSetting: function (settingName) {
    AppDispatcher.dispatch({
      actionType: AppConstants.TUPIQ_TOGGLE_SETTING,
      settingName: settingName
    });
  },

  setTempUnit: function (unit) {
    AppDispatcher.dispatch({
      actionType: AppConstants.TUPIQ_SET_TEMP_UNIT,
      unit: unit
    });
  }
};

module.exports = TupiqActions;
