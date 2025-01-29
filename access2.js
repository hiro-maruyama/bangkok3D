import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
// parameter setting
var zopacity=0.7;
const transparencyValueSpan = document.getElementById('transparencyValue');
const transparencyInput = document.getElementById('transparency');
transparencyValueSpan.innerHTML =`${transparencyInput.value / 10} `;

// const MAPTILER_KEY = 'get_your_own_OpIi9ZULNHzrESv6T2vL';
const MAPTILER_KEY = 'fh40KwnIDXcNE7AwKtkT';
const map = new maplibregl.Map({
    style: `https://api.maptiler.com/maps/basic-v2/style.json?key=${MAPTILER_KEY}`,
//     center: [-74.0066, 40.7135],     
//     center: [140.1270,36.0478 ],
    center:[100.54,13.74],
    zoom: 15.5,
    pitch: 45,
    bearing: -17.6,
    container: 'map',
    antialias: true
});

// The 'building' layer in the streets vector source contains building-height
// data from OpenStreetMap.
map.on('load', () => {
    // Insert the layer beneath any symbol layer.
    const layers = map.getStyle().layers;

/*    map.addSource('openmaptiles', {
        url: `https://api.maptiler.com/tiles/v3-openmaptiles/tiles.json?key=${MAPTILER_KEY}`,
//          url: `https://api.maptiler.com/tiles/v2/tiles.json?key=${MAPTILER_KEY}`,
       
        type: 'vector',
    }); */

    map.addSource('popdistance', {
        'type':'geojson',
        'data': `${location.href.replace('index.html','')}polygon1km_pop-dis.geojson`,
        'attribution':"<a href='https://data.humdata.org/dataset/worldpop-population-density-for-thailand' target='_blank'>Thailand Population Density</a>",
    });

    map.addSource('railway',{
        'type':'geojson',
        'data':`${location.href.replace('index.html','')}hotosm_tha_railways_lines.geojson`,
        'attribution': "<a href='https://data.humdata.org/dataset/hotosm_tha_railways' target='_blank'>Thailand railway</a>",
    })

    map.addSource('station',{
        'type':'geojson',
        'data':`${location.href.replace('index.html','')}hotosm_tha_railways_points.geojson`,
        'attribution': "<a href='https://data.humdata.org/dataset/hotosm_tha_railways' target='_blank'>Thailand railway</a>",
    })  

/*    map.addLayer(
        {
            'id': '3d-buildings',
            'source': 'openmaptiles',
            'source-layer': 'building',
    /*        'type': 'fill-extrusion',
            'type': 'fill'
            'minzoom': 15,
            'filter': ['!=', ['get', 'hide_3d'], true],
            'paint': {
                'fill-extrusion-color': [
                    'interpolate',
                    ['linear'],
                    ['get', 'render_height'], 0, 'lightgray', 70, 'royalblue', 250, 'red'
                ],
                'fill-extrusion-height': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    15,
                    0,
                    16,
                    ['get', 'render_height']
                ],
                'fill-extrusion-base': ['case',
                    ['>=', ['get', 'zoom'], 16],
                    ['get', 'render_min_height'], 0
                ]  */
     /*       'type': 'fill',
            'paint': {
                'fill-color': '#F00',
            },
        },
    ); */
    map.addLayer(
        {
            'id': 'z-distance',
            'source': 'popdistance',
 /*           'source-layer': '',
            'type': 'fill',
            'paint': {
                'fill-color': '#FF0',
            }, */
            'type': 'fill-extrusion',
            'paint': {
//                'fill-extrusion-color': ['get', 'color'],
                'fill-extrusion-color': [
                'interpolate',
                ['linear'],
                ['get', 'z'],
                0, 
                '#ffffff',
                100,
                '#ffcccc',
                1000,
                '#ffaaaa',
                5000,
                '#ff8888',
                10000,
                '#ff6666',
                30000,
                '#ff0000',
                ],
            
 //               'fill-extrusion-opacity': 0.7,
                'fill-extrusion-opacity': zopacity,               
                'fill-extrusion-height': ['get', 'dis2'],
            },

        },
    );

    map.addLayer(
        {
            'id': 'z-railway',
            'source': 'railway',
            'type': 'line',           
            'paint': {               
            'line-color': '#555',
            'line-width': 4,
            },
        },
    );

    map.addLayer(
        {
            'id': 'z-station',
            'source': 'station',
//            'type': 'fill-extrusion',
            'type': 'circle',           
            'paint': {               
  //          'fill-extrusion-color': '#00f',
  //          'fill-extrusion-height': 0,
              'circle-color': '#00f',
              'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                5,2,14,6,
              ]
            },
        },

//         labelLayerId
    );
//     console.log(layer.length)
});

transparencyInput.addEventListener('change', (e) => {
    transparencyValueSpan.innerHTML =`${transparencyInput.value / 10} `;
    zopacity=parseFloat(transparencyInput.value/10);
    map.setPaintProperty('z-distance','fill-extrusion-opacity',zopacity);
    },
);

const layonoff1=document.getElementById("z-railway");
const layonoff2=document.getElementById("z-station");


layonoff1.addEventListener('click',() => {
    if(layonoff1.checked==true) {
        map.setLayoutProperty("z-railway", "visibility", "visible");
    } else {
        map.setLayoutProperty("z-railway", "visibility", "none");
//        alert(" check box chenged to off");    
    }   
});

layonoff2.addEventListener('click',() => {
    if(layonoff2.checked==true) {
        map.setLayoutProperty("z-station", "visibility", "visible");
    } else {
        map.setLayoutProperty("z-station", "visibility", "none"); 
    }   
});