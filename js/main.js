const colors = [
  '#7c7c7c',
  '#d34f00',
  '#b96500',
  '#a57000',
  '#937800',
  '#817f00',
  '#6c8500',
  '#4f8a00',
  '#009004',
  '#008f42',
  '#008e5d',
  '#008d6f',
  '#008c7d',
  '#008b89',
  '#008a94',
  '#00899f',
  '#0088aa',
  '#0086b7',
  '#0084c7',
  '#0081dc',
  '#007afe',
  '#606fff',
  '#8f5dff',
  '#bc3afc',
  '#db00dd',
  '#e400b5',
  '#e90096',
  '#ed007a',
  '#f0005e',
  '#f2003f',
  '#f30011'
]

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


  gpxFiles$.then(gpxFiles => {
    return gpxFiles.forEach((gpxFile, index) => {
      let gpxOptions = {
        async: true,
        marker_options: {
          startIconUrl: '', //'img/pin-icon-start.png',
          endIconUrl: '', // 'img/pin-icon-end.png',
          shadowUrl: '' // 'img/pin-shadow.png'
        },
        polyline_options: {
          color: colors[(index * 37) % colors.length],
          opacity: 0.75
        }
      };
      new L.GPX(gpxFile, gpxOptions).on('loaded', function (e) {
        const gpx = e.target;
        //  mymap.fitBounds(e.target.getBounds());
        console.log({gpx})
        const link = gpx.get_link();
        let author = gpx.get_author();
        gpx.bindPopup(
          '<b>' + gpx.get_name() + '</b>' +
          (author ? '<i>' + author + '</i>' : '') +
          (link ? '<br><a href="' + link + '">Link</a>' : '')
        );
      }).addTo(mymap);
    });
  });
}


main();
