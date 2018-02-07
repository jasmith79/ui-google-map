import {
  UIBase,
  defineUIComponent,
  document,
  global
} from '../node_modules/ui-components-lite/src/utils/ui-component-base.js';

const tooLongMessage = `Sorry but google maps is taking longer than expected to load.
  If this message does not disappear in the next couple of seconds please refresh the page.`;

const failMessage = `Oops! Looks like Google Maps failed to load. Please refresh the page.`;

const warnTimeout = 8000;
const failTimeout = 15000;

// One of the most idiotic things I've ever seen, and for JavaScript, that's really saying
// something.
const KEYMAP = key => {
  switch (key) {
    case 'ArrowUp':
    case 'Up':
      return 38;

    case 'ArrowDown':
    case 'Down':
      return 40;

    case 'ArrowLeft':
    case 'Left':
      return 37;

    case 'ArrowRight':
    case 'Right':
      return 39;

    case 'Add':
    case 'Equal':
      return 187;

    case 'Minus':
    case 'Subtract':
      return 189;

    default: return 0;
  }
};

let mapsLoaded = false;

export const mapsAPILoaded = (() => {
  return new Promise((res, rej) => {
    const warnHandle = global.setTimeout(() => {
      (document.querySelector('ui-alert') || global).alert(tooLongMessage);
    }, warnTimeout);

    const failHandle = global.setTimeout(() => {
      (document.querySelector('ui-alert') || global).alert(failMessage);
    }, failTimeout);

    global._resolveMapsLoader = function() {
      clearTimeout(warnHandle);
      clearTimeout(failHandle);
      const alerter = document.querySelector('ui-alert');
      if (alerter && alerter.isOpen) alerter.close();
      global.dispatchEvent(new CustomEvent('google-maps-ready'));
      res(true);
    }

    if (global.google && global.google.maps && global.google.maps.Map) global._resolveMapsLoader();
  });
})();

const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      min-width: 400px;
      min-height: 300px;
    }

    #map-container {
      height: 100%;
      width: 100%;

      /* This is here because with no initial content height was 0 despite the parent styles */
      min-width: 400px;
      min-height: 300px;
    }
  </style>
  <div id="map-container"></div>
`;

const reflectedAttributes = [
  'latitude',
  'longitude',
  'map-type',
  'zoom-level',
];

export const GoogleMap = defineUIComponent({
  name: 'ui-google-map',
  template,
  reflectedAttributes,
  definition: class GoogleMap extends UIBase {
    constructor (apikey) {
      super();
      this._mapContainer = null;
      this._mapObj = null;
      this._center = null;
      this._keydownHandler = null;
      this._API_KEY = apikey;
    }

    get map () {
      return this._mapObj;
    }

    setCenter (...args) {
      const latlng = (() => {
        switch (args.length) {
          case 1: return args[0];
          case 2: return new global.google.maps.LatLng(...args);
          default: throw new TypeError(`Unrecognized arguments ${args} to ui-google-map's setCenter.`);
        }
      })();

      this._center = latlng;
      return this;
    }

    _addKeyboardHandler () {
      document.addEventListener('keydown', this._keydownHandler);
      return this;
    }

    _removeKeyboardHandler () {
      document.removeEventListener('keydown', this._keydownHandler);
      return this;
    }

    init () {
      super.init();

      const API_KEY = this.attr('api-key') || this._API_KEY;
      if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') throw new Error('No google maps API key!');

      if (!mapsLoaded) {
        mapsLoaded = true;
        const mapsAPI = document.createElement('script');
        mapsAPI.src = 'https://maps.googleapis.com/maps/api/js?' +
          `key=${API_KEY}&callback=_resolveMapsLoader`;

        document.head.appendChild(mapsAPI);
      }

      this._beforeReady(() => {
        return mapsAPILoaded.then(_ => {
          this._mapContainer = this.selectInternalElement('#map-container');
          const options = {
            zoom: 11,
            center: new global.google.maps.LatLng(39.75, -86.16),
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };

          if (this.mapType && this.mapType.toUpperCase() in global.google.maps.MapTypeId) {
            options.mapTypeId = global.google.maps[this.mapType.toUpperCase()];
          }

          if (this.attr('zoom-level')) {
            options.zoom = this.attr('zoom-level');
          } else {
            this.attr('zoom-level', options.zoom);
          }

          if (this.attr('latitude') && this.attr('longitude')) {
            options.center = new global.google.maps.LatLng(this.attr('latitude'), this.attr('longitude'));
          } else {
            this.attr('latitude', options.center.lat());
            this.attr('longitude', options.center.lng());
          }

          this._center = options.center;
          this._mapObj = new global.google.maps.Map(this._mapContainer, options);

          // Google maps really don't like to be unrendered, especially when they're first created:
          // tiles won't render until a resize event is triggered on window. So we'll track center
          // changes and set it manually. Currently the parent element responsible for rendering
          // this element needs to trigger resize on visibility changes, which I'm hoping to fix.
          // Currently, if setting the center programmatically, use the element's method rather
          // than the underlying map object's.
          this._mapObj.addListener('zoom_changed', e => {
            this._center = this.map.getCenter();
          });

          this._mapObj.addListener('dragend', e => {
            this._center = this.map.getCenter();
          });

          // mimic the google maps desktop keyboard shortcuts
          this._keydownHandler = e => {
            let value = e.keyCode || KEYMAP(e.key);
            switch (value) {
              case 107: // numpad add
              case 187: // equals/plus
                this._mapObj.setZoom(this._mapObj.getZoom() + 1);
                break;

              case 109: // numpad subtract
              case 189: // minus
                this._mapObj.setZoom(this._mapObj.getZoom() - 1);
                break;

              case 37: // left
                this._mapObj.panBy(-50, 0);
                break;

              case 38: // up
                this._mapObj.panBy(0, 50);
                break;

              case 39: // right
                this._mapObj.panBy(50, 0);
                break;

              case 40: // down
                this._mapObj.panBy(0, -50);
                break;

            }
          };

          this.on('mouseenter', e => {
            this._addKeyboardHandler();
          });

          this.on('mouseleave', e => {
            this._removeKeyboardHandler();
          });

          global.addEventListener('resize', e => {
            global.setTimeout(() => {
              this.map.setCenter(this._center);
            }, 0);
          });
        });
      });
    }
  }
});
