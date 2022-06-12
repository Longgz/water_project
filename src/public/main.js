import {Vector,
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
  Overlay } from "./olLayer.js";

var draw, selectGeomType;
var flagIsDrawingOn = false;
var PointType = ['Thượng nguồn', 'Hạ nguồn'];
var LineType = ['Sông lớn', 'Sông vừa', 'Sông nhỏ', 'Sông dài', 'Sông vừa', 'Sông ngắn'];
var PolygonType = ['Vùng sông lớn', 'Vùng sông vừa', 'Vùng sông nhỏ'];


// create view
const view = new View({
  projection: 'EPSG:4326',
  center: [109.30410259359883, 18.783124226680727],
  rotation: 0,
  zoom: 7
});


// OSM map
const layerOSM = new TileLayer({
  source: new OSM(),
  title: 'mapOSM'
})


// base layer array
const baseMap = [layerOSM];


// Start: Draw
class RotateNorthControl extends Control {
  constructor(opt_options) {
    const options = opt_options || {};

    const button = document.createElement('button');
    button.id = 'btnDraw';
    button.innerHTML = '<i class="fa-solid fa-pen-ruler"></i>';

    const element = document.createElement('div');
    element.className = 'draw-app ol-unselectable ol-control';
    element.appendChild(button);

    super({
      element: element,
      target: options.target,
    });
    
    const startStopApp = function() {
      if(flagIsDrawingOn == false) {
          $('#startDrawModal').modal('show');
      } else {
          map.removeInteraction(draw);
          flagIsDrawingOn = false;
          document.getElementById('btnDraw').innerHTML = '<i class="fa-solid fa-pen-ruler"></i>';
          defineTypeofFeature();
          $('#enterInformationModal').modal('show');
      }
    };

  //   button.addEventListener('click', this.handleRotateNorth.bind(this));
    button.addEventListener('click', startStopApp, false);
    button.addEventListener('touchstart', startStopApp, false);

  };  
  // handleRotateNorth() {
  //   this.getMap().getView().setRotation(0);
  // }
}
// End: Draw


// create overview map control
const overviewMapControl = new OverviewMap({
  className: 'ol-overviewmap ol-custom-overviewmap',
  layers: [   
      new TileLayer({
          source: new OSM(),
      }),
  ],
  collapseLabel: '\u00BB',
  label: '\u00AB',
  collapsed: false,
});


//create zoom slider
const zoomSlider = new ZoomSlider();


// create mouse position control
const mousePositionControl = new MousePosition({
    coordinateFormat: createStringXY(4),
    projection: 'EPSG: 4326',
    className: 'custom-mouse-position',
    target: 'mouse-position'
});


// waterLayer
const waterVector = new Vector({
  source: new VectorSource({
      format: new GeoJSON(),
      url: function(extent) {
          return (  
              'http://localhost:8080/geoserver/DHQS56/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=DHQS56%3Agis_osm_water_a_free_1&outputFormat=application%2Fjson'
              );
      },
    bbox: bboxStrategy,
  }),
  style: new Style({
    stroke: new Stroke({
      color: 'aqua',
      width: 1,
    }),
    fill: new Fill({
        color: 'aqua',
    })
  }),
  visible: false,
  title: 'waterVector',
  serverType: 'geoserver',
  projection: 'EPSG: 4326'
});


// water way layer
const waterWayVector = new Vector({
  source: new VectorSource({
      format: new GeoJSON(),
      url: 'http://localhost:8080/geoserver/DHQS56/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=DHQS56%3Agis_osm_waterways_free_1&outputFormat=application%2Fjson',
      bbox: bboxStrategy,
  }),
  style: new Style({
      stroke: new Stroke({
          color: 'blue',
          width: 1,
      }),
  }),
  visible: false,
  title: 'waterWayVector',
  serverType: 'geoserver',
  projection: 'EPSG: 4326'
})


// group water layer
const waterGroup = new LayerGroup({
  layers: [
      waterVector, waterWayVector
  ]
})

// create map
const map = new Map({
  target: 'map',
  view: view,
  controls: defaultControls().extend([
    mousePositionControl, 
    new FullScreen(),
    overviewMapControl,
    new RotateNorthControl()
  ]),
  //rotate map
  interactions: defaultInteractions().extend([new DragRotateAndZoom()]),
  layers: baseMap,
});

const drawSource = new VectorSource;
const drawLayer = new Vector({
  source: drawSource,
})

// add layer group into map
map.addLayer(waterGroup);
map.addLayer(drawLayer);
map.addControl(zoomSlider);



// Start: geolocation
  //create geolocation
  const geolocation = new Geolocation({
    trackingOptions: {
        enableHighAccuracy: true,
    },
    projection: view.getProjection(),
  });

  function el(id) {
    return document.getElementById(id);
  };

  el('track').addEventListener('change', function(){
    // get tracking
    geolocation.setTracking(this.checked);
  });

  // handle geolocation error
  geolocation.on('error', function(error) {
    console.log(error.message);
    const error1 = document.getElementById('error');
    error1.innerHTML = 'Can not find your position';
  });

  //create accuracy Feature
  const accuracyFeature = new Feature();
  geolocation.on('change:accuracyGeometry', function() {
    accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
  });

  const positionFeature = new Feature();
  positionFeature.setStyle(
    new Style({
        image: new CircleStyle({
            radius: 6,
            fill: new Fill({
                color: 'red',
            }),
            stroke: new Stroke({
                color: '#fff',
                width: 2,
            })
        }),
    }),
  );

  geolocation.on('change:position', function(){
    const coordinates = geolocation.getPosition();
    positionFeature.setGeometry(coordinates ? new Point(coordinates) : null);
  });

  const locationLayer = new Vector({
    // map: map: lớp phủ trên bản đồ. bản đồ ko quản lý lớp này trong bộ sưu tập
    // các lớp của nó và lớp sẽ được hiển thị trên cùng (rất hữu ích với lớp tạm thời)
    map: map,
    source: new VectorSource({
        features: [accuracyFeature, positionFeature],
    }),
    title: 'locationLayer',
  });
// End: geolocation (no action, fix: map.addLayer(locationLayer))




// Switcher of layer
let baseLayerElements = document.querySelectorAll('#visible-layer > input[type=checkbox]');
for(let baseLayerElement of baseLayerElements) {
    baseLayerElement.addEventListener('click', ()=> {
        if(baseLayerElement.checked) {
        let baseLayerElementValue = baseLayerElement.value;
        waterGroup.getLayers().forEach(function(element, index, array) {
            if(element.get('title') === baseLayerElementValue) {
                element.setVisible(true);
            }
        });
        } 
        else
        {
            let baseLayerElementValue = baseLayerElement.value;
            waterGroup.getLayers().forEach(function(element, index, array) {
            if(element.get('title') === baseLayerElementValue) {
                element.setVisible(false);
            }
        });
        }
    });
};
// End: Switcher of layer


// start: Draw 

// function startDraw(geomType) {
//     console.log(geomType);
// }
// html:
// <a onclick= "startDraw('point')">...</a>
// not works

//replace: (get geomType by id =))
let btn_adds = document.querySelectorAll('.card .card-link');
btn_adds.forEach(btn_add => {
    btn_add.addEventListener('click', (e) => {
        selectGeomType = btn_add.id;
        draw = new Draw({
            type: selectGeomType,
            source: drawSource,
        });
        $('#startDrawModal').modal('hide');
        // clear old draw
        drawSource.clear();
        document.getElementById('btnDraw').innerHTML = '<i class="fa-regular fa-circle-stop"></i>';
        map.addInteraction(draw);
        flagIsDrawingOn = true;
    })
});
//end: draw



// Fn to add types based on feature
function defineTypeofFeature() {
  let dropOnOfType = document.getElementById('typeOfFeature') ;
  // delete all op existing 
  dropOnOfType.innerHTML ='';
  if(selectGeomType == 'Point') {
      let pointLength = PointType.length;
      for(let i=0; i<pointLength; i++) {
          var op = document.createElement('option');
          op.value = PointType[i];
          op.innerHTML = PointType[i];
          dropOnOfType.appendChild(op);
      }
  } else if(selectGeomType == 'LineString') {
      let lineLenght = LineType.length;
      for(let i=0; i<lineLenght; i++) {
          var op = document.createElement('option');
          op.value = LineType[i];
          op.innerHTML = LineType[i];
          dropOnOfType.appendChild(op);
      }
  } else {
      let polygonLength = PolygonType.length;
      for(let i=0; i<polygonLength; i++) {
          var op = document.createElement('option');
          op.value = PolygonType[i];
          op.innerHTML = PolygonType[i];
          dropOnOfType.appendChild(op);
      }
  }
};


// Start: popup feature
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');

// Create an overlay to anchor the popup to the map
var overlay = new Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
        duration: 250
    }
});

map.addOverlay(overlay);

var featureOverlay = new Vector({
  tile: 'highlight',
  source: new VectorSource(),
  map: map
});

map.on('click', function(evt) {
  container.classList.remove('ol-popup__hide');

  if(featureOverlay) {
      featureOverlay.getSource().clear();
      map.removeLayer(featureOverlay);
  }

  var feature1 = map.forEachFeatureAtPixel(evt.pixel, 
      function(feature1) {
          return feature1;
  })
  console.log(feature1.get('osm_id'));

  if(feature1) {
      //gọi đến đối tượng hình học (geometry)
      var geometry = feature1.getGeometry();
      var coord = geometry.getCoordinates();
      var coordinate = evt.coordinate;

      featureOverlay.getSource().addFeature(feature1);
      //overlays.getLayers().push(featureOverlay);
      if(feature1.get('osm_id') != undefined) {
        var content1 = '<h3>' + feature1.get('fclass') + '</h3>';
        content1 += '<h5>' + feature1.get('name') + '</h5>';
        // content1 += '<h5>' + feature1.get('photo') + '</h5>';
  
        content.innerHTML = content1;
        overlay.setPosition(coordinate);
  
        // layerSwitcher.renderPanel();
        map.updateSize();
      }

  }
}
)

closer.addEventListener('click', function () {
  container.classList.add('ol-popup__hide');
})


