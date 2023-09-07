const apiKey = "mqVBkEDJKwEtL2xVKR1mBAYdWCvU4qdOZgx2LNbJ";

const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;

function fetchNASAData() {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const imageUrl = data.url;

      const imageElement = document.getElementById("image");

      imageElement.src = imageUrl;
    })
    .catch((error) => console.error(error));
}

window.onload = fetchNASAData;
