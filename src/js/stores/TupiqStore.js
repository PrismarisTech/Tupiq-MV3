var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');
var Persist = require('../utils/Persist');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var isDragging = false;
var isMinimised = Persist.getItem(AppConstants.LOCAL_TUPIQ_MINIMISED, false) || false;
var coordinates = Persist.getItem(AppConstants.LOCAL_TUPIQ_COORDINATES, false) || { x: .5, y: .5 };
var dragOriginData = { scrollOriginX: null, scrollOriginY: null, elementOriginX: null, elementOriginY: null };
var settings = {
  optsTempUnit: '',
  optsHideCalendar: false,
  optsHideWeather: false,
  optsHideTopSites: false
};

// Initialize settings from storage
if (typeof chrome !== 'undefined' && chrome.storage) {
  chrome.storage.sync.get({
    optsTempUnit: '',
    optsHideCalendar: false,
    optsHideWeather: false,
    optsHideTopSites: false
  }, function (items) {
    settings = items;
    TupiqStore.emitChange();
  });

  // Listen for changes
  chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (namespace === 'sync') {
      for (var key in changes) {
        if (settings.hasOwnProperty(key)) {
          settings[key] = changes[key].newValue;
        }
      }
      TupiqStore.emitChange();
    }
  });
}

var TupiqStore = assign({}, EventEmitter.prototype, {
  getDragging: function () {
    return isDragging;
  },

  getMinimised: function () {
    return isMinimised
  },

  getCoordinates: function () {
    return coordinates;
  },

  getDragOriginData: function () {
    return dragOriginData;
  },

  getSettings: function () {
    return settings;
  },

  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case AppConstants.TUPIQ_DRAG_START:
      isDragging = true;
      dragOriginData = action.dragOriginData;
      TupiqStore.emitChange();
      break;

    case AppConstants.TUPIQ_DRAG_STOP:
      isDragging = false;
      TupiqStore.emitChange();
      break;

    case AppConstants.TUPIQ_REPOSITION:
      coordinates = action.coordinates;
      Persist.setItem(AppConstants.LOCAL_TUPIQ_COORDINATES, coordinates, false);
      TupiqStore.emitChange();
      break;

      TupiqStore.emitChange();
      break;

    case AppConstants.TUPIQ_TOGGLE_SETTING:
      var settingName = action.settingName;
      settings[settingName] = !settings[settingName];

      var saveObj = {};
      saveObj[settingName] = settings[settingName];

      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.set(saveObj);
      }

      TupiqStore.emitChange();
      break;

    case AppConstants.TUPIQ_SET_TEMP_UNIT:
      settings.optsTempUnit = action.unit;

      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.set({ optsTempUnit: action.unit });
      }

      TupiqStore.emitChange();
      break;

    default:
    // no op
  }
});

module.exports = TupiqStore;
