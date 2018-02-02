'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GoogleMap = exports.mapsAPILoaded = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _uiComponentBase = require('../node_modules/ui-components-lite/utils/ui-component-base.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var tooLongMessage = 'Sorry but google maps is taking longer than expected to load.\n  If this message does not disappear in the next couple of seconds please refresh the page.';

var failMessage = 'Oops! Looks like Google Maps failed to load. Please refresh the page.';

var warnTimeout = 8000;
var failTimeout = 15000;

var mapsLoaded = false;

var mapsAPILoaded = exports.mapsAPILoaded = function () {
  return new Promise(function (res, rej) {
    var warnHandle = _uiComponentBase.global.setTimeout(function () {
      (_uiComponentBase.document.querySelector('ui-alert') || _uiComponentBase.global).alert(tooLongMessage);
    }, warnTimeout);

    var failHandle = _uiComponentBase.global.setTimeout(function () {
      (_uiComponentBase.document.querySelector('ui-alert') || _uiComponentBase.global).alert(failMessage);
    }, failTimeout);

    _uiComponentBase.global._resolveMapsLoader = function () {
      clearTimeout(warnHandle);
      clearTimeout(failHandle);
      var alerter = _uiComponentBase.document.querySelector('ui-alert');
      if (alerter && alerter.isOpen) alerter.close();
      _uiComponentBase.global.dispatchEvent(new CustomEvent('google-maps-ready'));
      res(true);
    };

    if (_uiComponentBase.global.google && _uiComponentBase.global.google.maps && _uiComponentBase.global.google.maps.Map) _uiComponentBase.global._resolveMapsLoader();
  });
}();

var template = _uiComponentBase.document.createElement('template');
template.innerHTML = '\n  <style>\n    :host {\n      display: block;\n      min-width: 400px;\n      min-height: 300px;\n    }\n\n    #map-container {\n      height: 100%;\n      width: 100%;\n\n      /* This is here because with no initial content height was 0 despite the parent styles */\n      min-width: 400px;\n      min-height: 300px;\n    }\n  </style>\n  <div id="map-container"></div>\n';

var reflectedAttrs = ['latitude', 'longitude', 'map-type', 'zoom-level'];

var GoogleMap = exports.GoogleMap = (0, _uiComponentBase.defineUIComponent)({
  name: 'ui-google-map',
  template: template,
  definition: function (_UIBase) {
    _inherits(GoogleMap, _UIBase);

    function GoogleMap() {
      _classCallCheck(this, GoogleMap);

      var _this = _possibleConstructorReturn(this, (GoogleMap.__proto__ || Object.getPrototypeOf(GoogleMap)).call(this));

      _this._mapContainer = null;
      _this._mapObj = null;
      _this._center = null;
      return _this;
    }

    _createClass(GoogleMap, [{
      key: 'setCenter',
      value: function setCenter() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var latlng = function () {
          switch (args.length) {
            case 1:
              return args[0];
            case 2:
              return new (Function.prototype.bind.apply(_uiComponentBase.global.google.maps.LatLng, [null].concat(args)))();
            default:
              throw new TypeError('Unrecognized arguments ' + args + ' to ui-google-map\'s setCenter.');
          }
        }();

        this._center = latlng;
        return this;
      }
    }, {
      key: 'init',
      value: function init() {
        var _this2 = this;

        _get(GoogleMap.prototype.__proto__ || Object.getPrototypeOf(GoogleMap.prototype), 'init', this).call(this);

        if (!mapsLoaded) {
          mapsLoaded = true;
          var API_KEY = this.attr('api-key');
          if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') throw new Error('No google maps API key!');
          var mapsAPI = _uiComponentBase.document.createElement('script');
          mapsAPI.src = 'https://maps.googleapis.com/maps/api/js?' + ('key=' + API_KEY + '&callback=_resolveMapsLoader');

          _uiComponentBase.document.head.appendChild(mapsAPI);
        }

        mapsAPILoaded.then(function (_) {
          _this2._mapContainer = _this2.selectInternalElement('#map-container');
          var options = {
            zoom: 11,
            center: new _uiComponentBase.global.google.maps.LatLng(39.75, -86.16),
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };

          if (_this2.mapType && _this2.mapType.toUpperCase() in _uiComponentBase.global.google.maps.MapTypeId) {
            options.mapTypeId = _uiComponentBase.global.google.maps[_this2.mapType.toUpperCase()];
          }

          if (_this2.zoomLevel) options.zoom = _this2.zoomLevel;
          if (_this2.latitude && _this2.longitude) options.center = new _uiComponentBase.global.google.maps.LatLng(_this2.latitude, _this2.longitude);

          _this2._center = options.center;
          _this2._mapObj = new _uiComponentBase.global.google.maps.Map(_this2._mapContainer, options);

          // Google maps really don't like to be unrendered, especially when they're first created:
          // tiles won't render until a resize event is triggered on window. So we'll track center
          // changes and set it manually. Currently the parent element responsible for rendering
          // this element needs to trigger resize on visibility changes, which I'm hoping to fix.
          // Currently, if setting the center programmatically, use the element's method rather
          // than the underlying map object's.
          _this2._mapObj.addListener('zoom_changed', function (e) {
            _this2._center = _this2.map.getCenter();
          });

          _this2._mapObj.addListener('dragend', function (e) {
            _this2._center = _this2.map.getCenter();
          });

          // mimic the google maps desktop keyboard shortcuts
          var keydownHandler = function keydownHandler(e) {
            switch (e.keyCode) {
              case 107: // numpad add
              case 187:
                // equals/plus
                _this2._mapObj.setZoom(_this2._mapObj.getZoom() + 1);
                break;

              case 109: // numpad subtract
              case 189:
                // minus
                _this2._mapObj.setZoom(_this2._mapObj.getZoom() - 1);
                break;

              case 37:
                // left
                _this2._mapObj.panBy(-50, 0);
                break;

              case 38:
                // up
                _this2._mapObj.panBy(0, 50);
                break;

              case 39:
                // right
                _this2._mapObj.panBy(50, 0);
                break;

              case 40:
                // down
                _this2._mapObj.panBy(0, -50);
                break;

            }
          };

          _this2.on('mouseenter', function (e) {
            _uiComponentBase.document.addEventListener('keydown', keydownHandler);
          });

          _this2.on('mouseleave', function (e) {
            _uiComponentBase.document.removeEventListener('keydown', keydownHandler);
          });

          _uiComponentBase.global.addEventListener('resize', function (e) {
            _uiComponentBase.global.setTimeout(function () {
              _this2.map.setCenter(_this2._center);
            }, 0);
          });
        });
      }
    }, {
      key: 'map',
      get: function get() {
        return this._mapObj;
      }
    }]);

    return GoogleMap;
  }(_uiComponentBase.UIBase)
});
