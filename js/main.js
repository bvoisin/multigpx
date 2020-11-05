function sendRequestIntoPromise(request, dataToSend) {
  return new Promise(function (resolve, reject) {
    request.onload = function () {
      if (request.status === 200) {
        // If successful, resolve the promise by passing back the request response
        resolve(request.response);
      } else {
        // If it fails, reject the promise with a error message
        reject(Error('Image didn\'t load successfully; error code:' + request.statusText));
      }
    };
    request.onerror = function () {
      // Also deal with the case when the entire request fails to begin with
      // This is probably a network error, so reject the promise with an appropriate message
      reject(Error('There was a network error.'));
    };
    // Send the request
    request.send(dataToSend);
  });
}

/*const dropBoxSharedFolderLink = 'https://www.dropbox.com/sh/y7XXXXXX/AXXXXXX'

function getGpxFileList() {
  const http = new XMLHttpRequest();
  const url = 'https://api.dropboxapi.com/2/files/list_folder';
  http.open('POST', url);
  http.responseType = 'json'

  http.setRequestHeader('Content-Type', 'application/json');
  http.setRequestHeader('Authorization', 'Bearer ' + DROPBOX_KEY);
  return sendRequestIntoPromise(http, JSON.stringify({'path': '', 'shared_link': {'url': dropBoxSharedFolderLink + '?dl=0'}})).then(json => {
    console.log('json', json);
    return json.entries;
  });
  const e = {
    'path': '', 'shared_link': {'url': 'https://www.dropbox.com/sh/y7XXXXXX/AXXXXXX'}
  }
}

function getFileContent(fileName) {
  const http = new XMLHttpRequest();
  const url = dropBoxSharedFolderLink + 'https://api.dropboxapi.com/2/files/list_folder';
  http.open('POST', url);
  http.responseType = 'json'

  http.setRequestHeader('Content-Type', 'application/json');
  http.setRequestHeader('Authorization', 'Bearer ' + DROPBOX_KEY);
  return sendRequestIntoPromise(http, JSON.stringify({'path': '', 'shared_link': {'url': 'https://www.dropbox.com/sh/y7XXXXX/AACfXXXXXXX?dl=0'}})).then(json => {
    console.log('json', json);
    return json.entries;
  });
}
*/

function getGpxFileList() {
  return Promise.resolve([
    'Lucie G - Sortie à vélo le midi.gpx',
    'Aurore Ds - Course_pied_matinale.gpx',
    'Julien Chatel -  Petit_tour_jardin_Villemin_dont_6_30_30_.gpx',
    'Benoit V - Redécouverte de l’enclos.gpx',
  ].map(f => 'gpx/' + f));
}

function getFileContent(url) {
  const http = new XMLHttpRequest();
  http.open('GET', url);
  return sendRequestIntoPromise(http)
}

function getGpxFiles() {
  const gpxFiles = getGpxFileList();
  gpxFiles.then(files => {
    const f$s = files.map(f => getFileContent('gpx/' + f)).then(content => ({file: f, content}))
    return Promise.all(f$s)
  })
}

function main() {
  const gpxFiles$ = getGpxFileList();

  var mymap = L.map('mapid').setView([51.505, -0.09], 13);

  const mapboxToken = 'pk.eyJ1IjoiYnZvaXNpbiIsImEiOiJja2gzdjFreXEwMmtnMnpvOTJkMmZkYXpmIn0.6sxS5W8Q2fmNYpEgI6QnbA'
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxToken, {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'your.mapbox.access.token'
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
      mymap.fitBounds(e.target.getBounds());
    }).addTo(mymap);
  }));
}


main();
