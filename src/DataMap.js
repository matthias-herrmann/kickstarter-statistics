import './styles/stylesheet.css';
import 'ol/ol.css';
import Map from 'ol/map';
import Vector from 'ol/layer/vector';
import VectorSource from 'ol/source/vector';
import GeoJSONFormat from 'ol/format/geojson';
import View from 'ol/view';
import proj from 'ol/proj';
import Style from 'ol/style/style';
import Stroke from 'ol/style/stroke';
import Fill from 'ol/style/fill';
import control from 'ol/control';
import Control from 'ol/control/control';
import * as db from './DataManager';
import * as d3Scale from "d3-scale";

//todo map legend

export const createColorScale = (key, colors) => {
  const min = db.min(key),
    max = db.max(key),
    domain = [min, max];
  return d3Scale.scaleQuantize()
    .domain(domain)
    .range(colors);
};

export const getCountryColors = (colorScale, key) => {
  return db.countryToColors(country => colorScale(country[key]));
};

export const createVectorStyleFunction = countryColors => feature => new Style({
  stroke: new Stroke({
    color: 'cornflowerblue',
    width: 1.5,
  }),
  fill: new Fill({
    color: countryColors[feature.id_] || "white"
  })
});

export const createNewVectorLayer = () => new Vector({
  source: new VectorSource({
    url: './assets/countries.geojson',
    format: new GeoJSONFormat(),
  }),
});

export const drawNewMap = (target, layers) => new Map({
  layers: [
    layers,
  ],
  target: "map",
  view: new View({
    center: proj.fromLonLat([13.41, 52.52]), //Germany
    zoom: 4, //zoom constant
    maxZoom: 5,
    minZoom: 2,
    extent: [-10018254, -10018254, 10018254, 10018254],
  }),
  controls: control.defaults({
    rotate: false,
    attribution: false,
  }),
});

export const calcMapColors = (key, colorRange) => {
  const colorScale = createColorScale(key, colorRange);
  return getCountryColors(colorScale, key);
};

export const setMapColors = (countryColors, layer) => {
  layer.setStyle(createVectorStyleFunction(countryColors))
};

//todo better name, rework!!
export const createButtonControls = (textKeys, colors, layer) => {

  const controlsContainer = document.createElement('div');
  controlsContainer.className = "controls-container ol-unselectable";

  Object.keys(textKeys).forEach(key => {
    const container = document.createElement('div'),
      button = document.createElement('button');
    button.innerHTML = textKeys[key];
    button.addEventListener('click', () => {
      const colorScale = createColorScale(key, colors),
        countryColors = getCountryColors(colorScale, key);
      setMapColors(countryColors, layer);
    });
    container.className = 'category-container ol-control';
    container.appendChild(button);
    controlsContainer.appendChild(container);
  });

  return new Control({element: controlsContainer});
};
