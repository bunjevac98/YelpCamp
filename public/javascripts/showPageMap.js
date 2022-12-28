
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: [19.6, 46.1], // starting position [lng, lat]
    zoom: 4, // starting zoom
});
