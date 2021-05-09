import mapboxgl from 'mapbox-gl';
import Threebox from 'threebox-plugin/src/Threebox.js'; 

mapboxgl.accessToken = "pk.eyJ1Ijoibmlja3NocmVjayIsImEiOiJjazNrMHo0M3MwbjBrM2hvY2cyNWh2bmNqIn0.DN9uhBX4gMAuLFUytbrXfg"; // Enter mapbox token

let map = new mapboxgl.Map({
    style: "mapbox://styles/mapbox/satellite-v9?optimize=true",
    center: [7.059806068014609, 46.058219779837316],
    zoom: 9.848554211380023,
    pitch: 85,
    bearing: -154.1,
    container: 'map',
    antialias: true, 
    hash: true
});

map.on('style.load', function () {

    map.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
        'tileSize': 512,
        'maxzoom': 14
    });
    map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.0 });

    map.addLayer({
        id: '3D-overlay',
        type: 'custom',
        renderingMode: '3d',
        onAdd: function (map, mbxContext) {

            window.tb = new Threebox(
                map,
                map.getCanvas().getContext('webgl'),
                {
                    realSunlight: true,
                    // sky: true,
                    terrain: true,
                    enableSelectingObjects: true, 
                    enableTooltips: true,
                    defaultLights: true 
                }
            );

        },

        render: function (gl, matrix) {
            tb.update();
        }
    });

    addBike(3);
    addBike(4);

});

function addBike(num){

    var options = {
        obj: "./cycle/cycle.gltf",
        type: 'gltf',
        scale: 1000,
        units: 'meters',
        rotation: {x: 90, y:177, z:0},
        anchor: 'auto'
    }

    tb.loadObj(options, function (model) {

        tb.add(model);

        model.setCoords([6.927566+(num/10), 45.984111 + (num/10), 4000]);

        model.traverse(function (object) {
            object.frustumCulled = false;
        });

        model.playAnimation({ animation: 0, duration: 1000000000 });

        model.selected = true;

    })

}