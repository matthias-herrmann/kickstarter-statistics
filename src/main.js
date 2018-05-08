import "./styles/stylesheet.css"
import "ol/ol.css"
import Map from "ol/map";
import Vector from "ol/layer/vector";
import VectorSource from "ol/source/vector";
import GeoJSONFormat from "ol/format/geojson";
import View from "ol/view";
import proj from "ol/proj";


const olMap = new Map({
  target: 'map',
  layers: [
    new Vector({
      source: new VectorSource({
        url: 'https://openlayers.org/en/v4.6.5/examples/data/geojson/countries.geojson',
        format: new GeoJSONFormat()
      }),
    })
  ],
  view: new View({
    center: proj.fromLonLat([37.41, 20.82]),
    zoom: 4
  })
});
