function main() {
  const gpxFiles$ = awsGistGpxFiles(); // Promise of url[]

  var mymap = L.map('mapid').setView([48.864716, 2.349014], 13);

  const mapboxToken = 'pk.eyJ1IjoiYnZvaXNpbiIsImEiOiJja2gzdjFreXEwMmtnMnpvOTJkMmZkYXpmIn0.6sxS5W8Q2fmNYpEgI6QnbA'
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: mapboxToken
  }).addTo(mymap);


  gpxFiles$.then(gpxFiles => gpxFiles.forEach(gpxFile => {
    let gpxOptions = {
      async: true,
      marker_options: {
        startIconUrl: '', //'img/pin-icon-start.png',
        endIconUrl: '', // 'img/pin-icon-end.png',
        shadowUrl: '' // 'img/pin-shadow.png'
      }
    };
    new L.GPX(gpxFile, gpxOptions).on('loaded', function (e) {
      //  mymap.fitBounds(e.target.getBounds());
    }).addTo(mymap);
  }));
}


main();
