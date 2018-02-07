import API_KEY from '../support/apikey.js';
import { GoogleMap } from '../../src/gmap.js';

window.alert = () => {};

const timeout2Promise = (n, f, ...args) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(f(...args));
    }, n);
  });
};

describe('ui-google-map', () => {
  let div;

  beforeEach(() => {
    div = document.createElement('div');
    div.classList.add('remove-me');
    document.body.appendChild(div);
  });

  afterEach(() => {
    let els = [...document.querySelectorAll('.remove-me')];
    els.forEach(x => document.body.removeChild(x));
  });

  it('should be constructable by being added to the innerHTML of another element', done => {
    div.innerHTML += `<ui-google-map api-key="${API_KEY}"></ui-google-map>`;
    let map = div.querySelector('ui-google-map');
    map.onReady(_ => {
      expect(google).toBeDefined();
      expect(google.maps).toBeDefined();
      expect(map.map instanceof google.maps.Map).toBe(true);
      done();
    }).catch(err => {
      console.error(err);
      expect(false).toBe(true);
      done();
    });
  });

  // Because of the inherent need for an API key in the early stages of construction, using
  // document.createElement won't work. Once it's possible to construct the element via `new`
  // there's a constructor parameter for taking the API key but that hasn't currently been
  // implemented in any browser AFAIK.
  it('should NOT be constructable via document.createElement', done => {
    let handle = setTimeout(() => {
      expect(true).toBe(false);
      window.onerror = null;
      done();
    }, 150);

    let listener = err => {
      clearTimeout(handle);
      console.log(err);
      expect(true).toBe(true);
      window.onerror = null;
      done();
    };

    window.onerror = listener;
    let map = document.createElement('ui-google-map');
  });

  it('should reflect latitude, longitude, zoom', done => {
    div.innerHTML += `<ui-google-map api-key="${API_KEY}"></ui-google-map>`;
    let map = div.querySelector('ui-google-map');
    map.onReady(_ => {
      expect(map.latitude).toBeDefined();
      expect(typeof map.latitude).toBe('number');

      expect(map.longitude).toBeDefined();
      expect(typeof map.longitude).toBe('number');

      expect(map.zoomLevel).toBeDefined();
      expect(typeof map.zoomLevel).toBe('number');

      expect(map.attr('latitude')).not.toBeNull();
      expect(map.attr('latitude') > 0).toBe(true);
      expect(Number.isNaN(+map.attr('latitude'))).toBe(false);

      expect(map.attr('longitude')).not.toBeNull();
      expect(map.attr('longitude') < 0).toBe(true);
      expect(Number.isNaN(+map.attr('longitude'))).toBe(false);

      expect(map.attr('zoom-level')).not.toBeNull();
      expect(map.attr('zoom-level') > 0).toBe(true);
      expect(Number.isNaN(+map.attr('zoom-level'))).toBe(false);

      done();
    }).catch(err => {
      console.error(err);
      expect(false).toBe(true);
      done();
    });
  });

  // timeouts allow animation to finish
  it('should pan on arrow keys when the map is hover', done => {
    div.innerHTML += `<ui-google-map api-key="${API_KEY}"></ui-google-map>`;
    let map = div.querySelector('ui-google-map');
    map.onReady(_ => {
      map._addKeyboardHandler();
      let oldCenter = map.map.getCenter(), newCenter, evt;

      evt = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      document.dispatchEvent(evt);
      timeout2Promise(5, () => {
        newCenter = map.map.getCenter();
        expect(newCenter.toString()).not.toBe(oldCenter.toString());
        oldCenter = newCenter;

        evt = new KeyboardEvent('keydown', { key: 'ArrowUp' });
        document.dispatchEvent(evt);
      }).then(_ => {
        return timeout2Promise(5, () => {
          newCenter = map.map.getCenter();
          expect(newCenter.toString()).not.toBe(oldCenter.toString());
          oldCenter = newCenter;
        });
      }).then(_ => {
        evt = new KeyboardEvent('keydown', { key: 'ArrowUp' });
        document.dispatchEvent(evt);
      }).then(_ => {
        return timeout2Promise(5, () => {
          newCenter = map.map.getCenter();
          expect(newCenter.toString()).not.toBe(oldCenter.toString());
          oldCenter = newCenter;
        });
      }).then(_ => {
        evt = new KeyboardEvent('keydown', { key: 'ArrowRight' });
        document.dispatchEvent(evt);
      }).then(_ => {
        return timeout2Promise(5, () => {
          newCenter = map.map.getCenter();
          expect(newCenter.toString()).not.toBe(oldCenter.toString());
          oldCenter = newCenter;
        });
      }).then(_ => {
        evt = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
        document.dispatchEvent(evt);
      }).then(_ => {
        newCenter = map.map.getCenter();
        expect(newCenter.toString()).not.toBe(oldCenter.toString());
        done();
      }).catch(err => {
        console.error(err);
        expect(false).toBe(true);
        done();
      });
    }).catch(err => {
      console.error(err);
      expect(false).toBe(true);
      done();
    });
  });

  it('should zoom on +/= and - when map is hover', done => {
    div.innerHTML += `<ui-google-map api-key="${API_KEY}"></ui-google-map>`;
    let map = div.querySelector('ui-google-map');
    map.onReady(_ => {
      map._addKeyboardHandler();
      let oldZoom = map.map.getZoom(), newZoom, evt;
      evt = new KeyboardEvent('keydown', { key: 'Minus' });
      document.dispatchEvent(evt);

      timeout2Promise(5, () => {
        newZoom = map.map.getZoom();
        expect(newZoom.toString()).not.toBe(oldZoom.toString());
        oldZoom = newZoom;
      }).then(_ => {
        evt = new KeyboardEvent('keydown', { key: 'Equal' });
        document.dispatchEvent(evt);
      }).then(_ => {
        return timeout2Promise(5, () => {
          newZoom = map.map.getZoom();
          expect(newZoom.toString()).not.toBe(oldZoom.toString());
          oldZoom = newZoom;
        });
      }).then(_ => {
        evt = new KeyboardEvent('keydown', { key: 'Subtract' });
        document.dispatchEvent(evt);
      }).then(_ => {
        return timeout2Promise(5, () => {
          newZoom = map.map.getZoom();
          expect(newZoom.toString()).not.toBe(oldZoom.toString());
          oldZoom = newZoom;
        });
      }).then(_ => {
        evt = new KeyboardEvent('keydown', { key: 'Add' });
        document.dispatchEvent(evt);
        done();
      }).catch(err => {
        console.error(err);
        expect(false).toBe(true);
        done();
      });
    }).catch(err => {
      console.error(err);
      expect(false).toBe(true);
      done();
    });
  });
});
