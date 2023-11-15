// NASA API endpoint for space weather data
const apiUrl =
  "https://api.nasa.gov/DONKI/notifications?api_key=mqVBkEDJKwEtL2xVKR1mBAYdWCvU4qdOZgx2LNbJ";

let latestSpaceWeatherData = null;

function fetchSpaceWeatherData() {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      // Store the latest space weather data
      latestSpaceWeatherData = data;
      updateDashboard(data);
    })
    .catch((error) =>
      console.error("Error fetching space weather data:", error)
    );
}

function updateDashboard(data) {
  // Check if data is defined
  if (data) {
    // Extract relevant information from the data (customize based on available data)
    const solarWindSpeed = data.map((entry) => entry.solarWindSpeed);
    const geomagneticStorms = data.map((entry) => entry.geomagneticStorm);
    const sunspotActivity = data.map((entry) => entry.sunspotActivity);

    // Check if solarWindSpeed is defined before updating
    if (solarWindSpeed !== undefined) {
      updateSolarWindSpeed(solarWindSpeed);
    }

    // Check if geomagneticStorms is defined before updating
    if (geomagneticStorms !== undefined) {
      updateGeomagneticStorms(geomagneticStorms);
    }

    // Check if sunspotActivity is defined before updating
    if (sunspotActivity !== undefined) {
      updateSunspotActivity(sunspotActivity);
    }
  }
}

// Function to update the solar wind speed visualization
function updateSolarWindSpeed(data) {
  const canvas = document.getElementById("solarWindSpeedCanvas");
  const context = canvas.getContext("2d");

  // Set canvas size
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  // Define sun properties
  const sunRadius = 50;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  // Clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the realistic sun in the middle
  drawRealisticSun(context, centerX, centerY, sunRadius);

  // Draw animating heat radiating from the sun
  const heatColor = animateHeatColor();
  context.beginPath();
  context.arc(centerX, centerY, canvas.width * 0.7, 0, 2 * Math.PI);
  const heatGradient = context.createRadialGradient(
    centerX,
    centerY,
    0,
    centerX,
    centerY,
    canvas.width * 0.7
  );
  heatGradient.addColorStop(0, heatColor);
  heatGradient.addColorStop(1, "transparent");
  context.fillStyle = heatGradient;
  context.fill();
  context.closePath();

  // Implement animation using requestAnimationFrame
  requestAnimationFrame(() => updateSolarWindSpeed(data));
}

// Function to draw a realistic sun with gradients
function drawRealisticSun(context, x, y, radius) {
  const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, "rgba(255, 255, 0, 1)");
  gradient.addColorStop(0.7, "rgba(255, 255, 0, 0.7)");
  gradient.addColorStop(1, "rgba(255, 255, 0, 0)");
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI);
  context.fillStyle = gradient;
  context.fill();
  context.closePath();
}

// Function to animate the heat color
function animateHeatColor() {
  const animationSpeed = 0.001;
  const alpha = 0.1 + 0.1 * Math.sin(Date.now() * animationSpeed);
  return `rgba(255, 165, 0, ${alpha})`;
}

// Function to update the geomagnetic storms visualization
function updateGeomagneticStorms(data) {
  const canvas = document.getElementById("geomagneticStormsCanvas");
  const context = canvas.getContext("2d");

  // Clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Set up the canvas dimensions
  const width = canvas.width;
  const height = canvas.height;

  // Draw black background with stars
  drawStars(context, width, height);

  // Draw Northern Lights with animation
  const numberOfLines = 20;

  for (let i = 0; i < numberOfLines; i++) {
    drawMovingNorthernLights(context, width, height, i);
  }
}

// Function to update the geomagnetic storms visualization
function updateGeomagneticStorms(data) {
  const canvas = document.getElementById("geomagneticStormsCanvas");
  const context = canvas.getContext("2d");

  // Fetch data from NASA API
  fetch(
    "https://api.nasa.gov/DONKI/notifications?api_key=mqVBkEDJKwEtL2xVKR1mBAYdWCvU4qdOZgx2LNbJ"
  )
    .then((response) => response.json())
    .then((apiData) => {
      // Use the fetched data along with the existing 'data' parameter
      const combinedData = [...data, ...apiData];

      // Rest of your existing code for visualization
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      drawStarryBackground(context, canvas.width, canvas.height);
      drawNorthernLights(context, canvas.width, canvas.height, Date.now());

      // Implement D3.js code for updating geomagnetic storms visualization on the canvas
    })
    .catch((error) => console.error("Error fetching NASA API data:", error));
}

// Function to draw a starry background on the canvas
function drawStarryBackground(context, width, height) {
  // Set the canvas background to black
  context.fillStyle = "black";
  context.fillRect(0, 0, width, height);

  // Draw stars
  const numStars = 200;
  for (let i = 0; i < numStars; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = Math.random() * 2;

    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.fillStyle = "white";
    context.fill();
    context.closePath();
  }
}

// Function to draw animated northern lights effect
function drawNorthernLights(context, width, height, timestamp) {
  const centerY = height / 2;
  const period = 5000; // Time for one complete cycle in milliseconds
  const amplitude = height / 3;
  const transparency = 0.5; // Adjust the transparency (0.0 to 1.0)

  const time = timestamp % period;
  const phase = (time / period) * 2 * Math.PI;

  // Clear the canvas
  context.clearRect(0, 0, width, height);

  // Draw a starry background
  drawStarryBackground(context, width, height);

  const gradient = context.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, `rgba(0, 0, 255, ${transparency})`); // Blue
  gradient.addColorStop(0.5, `rgba(128, 0, 128, ${transparency})`); // Purple
  gradient.addColorStop(1, `rgba(0, 255, 0, ${transparency})`); // Green

  context.beginPath();
  for (let x = 0; x <= width; x += 5) {
    const y = centerY + amplitude * Math.sin(phase + (x / width) * 2 * Math.PI);
    context.lineTo(x, y);
  }

  context.lineTo(width, height);
  context.lineTo(0, height);
  context.closePath();

  context.fillStyle = gradient;
  context.fill();

  // Animate the northern lights effect
  requestAnimationFrame((timestamp) =>
    drawNorthernLights(context, width, height, timestamp)
  );
}

function updateSunspotActivity(data) {
  const canvas = document.getElementById("sunspotActivityCanvas");
  const context = canvas.getContext("2d");

  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  // Set canvas background to black
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the sun in the middle of the canvas
  const sunRadius = 50;
  const sunX = canvas.width / 2;
  const sunY = canvas.height / 2;

  context.beginPath();
  context.arc(sunX, sunY, sunRadius, 0, 2 * Math.PI);
  context.fillStyle = "orange";
  context.fill();
  context.closePath();

  // Draw expanding yellow/orange line emanating from the sun
  const lineLength = 10;
  const speed = 10; // You can adjust the speed of the expansion
  const time = performance.now() * 0.001; // Use performance time for smooth animation

  for (let i = 0; i < data.length; i++) {
    const angle = (i / data.length) * 2 * Math.PI;
    const startX = sunX + sunRadius * Math.cos(angle);
    const startY = sunY + sunRadius * Math.sin(angle);

    const lineX =
      startX + Math.cos(angle) * lineLength * Math.cos(time * speed);
    const lineY =
      startY + Math.sin(angle) * lineLength * Math.cos(time * speed);

    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(lineX, lineY);
    context.strokeStyle = "yellow";
    context.lineWidth = 2;
    context.stroke();
    context.closePath();
  }

  // Request the next animation frame
  requestAnimationFrame(() => updateSunspotActivity(data));
}

// ... (your existing code)

// Add event listeners for hover effect
function addCanvasHoverEvents(canvasId, data) {
  const canvas = document.getElementById(canvasId);

  // Mouseenter event
  canvas.addEventListener("mouseenter", () => {
    showSpaceWeatherInfo(canvasId, data);
  });

  // Mouseleave event
  canvas.addEventListener("mouseleave", () => {
    hideSpaceWeatherInfo(canvasId);
  });
}

// Function to display space weather information on hover
function showSpaceWeatherInfo(canvasId, data) {
  const canvasContainer = document.getElementById(`${canvasId}Container`);

  // Create a div element for displaying information
  const infoDiv = document.createElement("div");
  infoDiv.className = "canvas-info";
  infoDiv.innerHTML = `<p>Space Weather Information:</p>
                        <ul>
                          <li>Solar Wind Speed: ${data.solarWindSpeed}</li>
                          <li>Geomagnetic Storm: ${data.geomagneticStorm}</li>
                          <li>Sunspot Activity: ${data.sunspotActivity}</li>
                        </ul>`;

  // Append the information div to the canvas container
  canvasContainer.appendChild(infoDiv);
}

// Function to hide space weather information on mouseleave
function hideSpaceWeatherInfo(canvasId) {
  const canvasContainer = document.getElementById(`${canvasId}Container`);
  const infoDiv = canvasContainer.querySelector(".canvas-info");

  // Remove the information div if it exists
  if (infoDiv) {
    canvasContainer.removeChild(infoDiv);
  }
}

// Call the fetchSpaceWeatherData function at regular intervals (e.g., every 5 minutes)
setInterval(fetchSpaceWeatherData, 5 * 60 * 1000);

// Call fetchSpaceWeatherData once on page load
fetchSpaceWeatherData();

// Add hover events for each canvas
addCanvasHoverEvents("solarWindSpeedCanvas", {
  /* Relevant data for solar wind speed */
});
addCanvasHoverEvents("geomagneticStormsCanvas", {
  /* Relevant data for geomagnetic storms */
});
addCanvasHoverEvents("sunspotActivityCanvas", {
  /* Relevant data for sunspot activity */
});
