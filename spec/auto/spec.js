describe('ui-google-map', () => {
  let div;
  let API_KEY = window.GOOGLE_MAPS_API_KEY;

  beforeEach(() => {
    div = document.createElement('div');
    div.classList.add('remove-me');
    document.body.appendChild(div);
  });

  afterEach(() => {
    let els = document.querySelectorAll('.remove-me');
    els.forEach(x => document.removeChild(x));
  });

  it('should be constructable by being added to the innerHTML of another element', () => {
    div.innerHTML += `<ui-google-map api-key="${API_KEY}"></ui-google-map>`;
    let m = div.querySelector('ui-google-map');
    map.onReady(_ => {
      expect(google).toBeDefined();
      expect(google.maps).toBeDefined();
      done();
    });
  });

  it('should be constructable via document.createElement', done => {
    let m = document.createElement('ui-google-map');
    m.attr('api-key', API_KEY);
    m.onReady(_ => {
      expect(true).toBe(true);
      done();
    });
    div.appendChild(m);
  });

  it('should have a map property that is a google.maps.Map', done => {
    div.innerHTML += `<ui-google-map api-key="${API_KEY}"></ui-google-map>`;
    let m = div.querySelector('ui-google-map');
    map.onReady(_ => {
      expect(map.map instanceof google.maps.Map).toBe(true);
      done();
    });
  });

  it('should throw on no API key or the placeholder', done => {

  });

  it('should reflect latitude, longitude, zoom', done => {

  });

  it('should pan on arrow keys when the map is hover', done => {

  });

  it('should zoom on +/= and - when map is hover', done => {

  });
;});