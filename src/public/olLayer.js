const Vector = ol.layer.Vector;
const LayerGroup = ol.layer.Group;
const TileLayer = ol.layer.Tile;
const VectorSource = ol.source.Vector;

const Map = ol.Map;
const View = ol.View;

const OSM = ol.source.OSM;
const GeoJSON = ol.format.GeoJSON;

const CircleStyle = ol.style.Circle;
const Stroke = ol.style.Stroke;
const Fill = ol.style.Fill;
const Style = ol.style.Style;

const bboxStrategy = ol.loadingstrategy.bbox;

const Control = ol.control.Control;
const OverviewMap = ol.control.OverviewMap;
const ZoomSlider = ol.control.ZoomSlider;
const FullScreen = ol.control.FullScreen;
const defaultControls = ol.control.defaults;
const MousePosition = ol.control.MousePosition;

const DragRotateAndZoom = ol.interaction.DragRotateAndZoom;
const defaultInteractions = ol.interaction.defaults;
const Draw = ol.interaction.Draw;

const createStringXY = ol.coordinate.createStringXY;

const Geolocation = ol.Geolocation;

const Feature =  ol.Feature;
const Point = ol.geom.Point;

const Overlay = ol.Overlay;

export {
Vector,
LayerGroup,
TileLayer,
VectorSource,
Map,
View,
OSM,
GeoJSON,
CircleStyle,
Stroke,
Fill,
Style,
bboxStrategy,
Control,
OverviewMap,
ZoomSlider,
FullScreen,
defaultControls,
MousePosition,
DragRotateAndZoom,
defaultInteractions,
Draw,
createStringXY,
Geolocation,
Feature,
Point,
Overlay
}