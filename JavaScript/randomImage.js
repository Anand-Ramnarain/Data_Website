

async function fetchRandomNasaImage(imgElement) {
  const SEARCH_TERM = imgElement.getAttribute("data-search-term") || "moon";
  const URL = `https://images-api.nasa.gov/search?q=${SEARCH_TERM}&media_type=image`;

  try {
    const response = await fetch(URL);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    const items = data.collection.items;

    if (!items.length) {
      throw new Error("No images found");
    }

    const randomIndex = Math.floor(Math.random() * items.length);
    const randomImage = items[randomIndex].links[0].href;

    imgElement.src = randomImage;
  } catch (error) {
    console.error(`Fetch failed for ${SEARCH_TERM}:`, error.message);
  }
}

// Fetch images for both elements
const imgElement1 = document.getElementById("nasaImage1");
const imgElement2 = document.getElementById("nasaImage2");

fetchRandomNasaImage(imgElement1);
fetchRandomNasaImage(imgElement2);
