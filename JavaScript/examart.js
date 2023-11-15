const svg = d3.select("#issSvg");
const infoBox = document.getElementById("infoBox");

const apiUrl = "https://api.wheretheiss.at/v1/satellites/25544";
const reverseGeocodeUrl =
  "https://api.bigdatacloud.net/data/reverse-geocode-client";

const earthGradientColors = ["#008000", "#00a1e4"];
const issGradientColors = ["#ff0000", "#660000"];

const fetchData = () => {
  fetch(apiUrl)
    .then((response) => response.json())
    .then(updateVisualization)
    .catch((error) => console.error("Error fetching data:", error))
    .finally(() => setTimeout(fetchData, 5000));
};

const updateVisualization = (data) => {
  svg.selectAll("*").remove();

  const stars = svg
    .selectAll("star")
    .data(d3.range(200))
    .enter()
    .append("circle")
    .attr("cx", () => Math.random() * 400)
    .attr("cy", () => Math.random() * 400)
    .attr("r", 1)
    .style("fill", "white");

  const earthRadius = 100;
  const earth = svg
    .append("circle")
    .attr("cx", 200)
    .attr("cy", 200)
    .attr("r", earthRadius)
    .style("fill", "url(#earth-gradient)")
    .on("mouseover", () => displayLocationInfo(data.latitude, data.longitude))
    .on("mouseout", hideInfo);

  const issSize = 5;
  const issX = 200 + data.longitude;
  const issY = 200 - data.latitude;
  const iss = svg
    .append("circle")
    .attr("cx", issX)
    .attr("cy", issY)
    .attr("r", issSize)
    .style("fill", "url(#iss-gradient)")
    .on("mouseover", () => displayISSInfo(data))
    .on("mouseout", hideInfo);

  createGradient(svg, "earth-gradient", earthGradientColors);
  createGradient(svg, "iss-gradient", issGradientColors);
};

const createGradient = (svg, id, colors) => {
  const gradient = svg
    .append("defs")
    .append("radialGradient")
    .attr("id", id)
    .attr("cx", "50%")
    .attr("cy", "50%")
    .attr("r", "50%");

  colors.forEach((color, index) => {
    gradient
      .append("stop")
      .attr("offset", `${(index * 100) / (colors.length - 1)}%`)
      .style("stop-color", color);
  });
};

const displayLocationInfo = (latitude, longitude) => {
  fetch(`${reverseGeocodeUrl}?latitude=${latitude}&longitude=${longitude}`)
    .then((response) => response.json())
    .then(getLocationInfo)
    .then(displayInfo)
    .catch((error) => console.error("Error fetching location data:", error));
};

const getLocationInfo = (locationData) => {
  const city = locationData.locality || "Unknown City";
  const country = locationData.countryName || "Unknown Country";

  return city === "Unknown City" && country === "Unknown Country"
    ? "<p>Over The Sea</p>"
    : `<p>Over ${city}, ${country}</p>`;
};

const displayISSInfo = (data) => {
  const issInfo = `
    <p>Latitude: ${data.latitude.toFixed(2)}°</p>
    <p>Longitude: ${data.longitude.toFixed(2)}°</p>
    <p>Altitude: ${data.altitude.toFixed(2)} km</p>
  `;
  displayInfo(issInfo);
};

const displayInfo = (content) => {
  infoBox.innerHTML = content;

  const svgRect = svg.node().getBoundingClientRect();
  infoBox.style.position = "absolute";
  infoBox.style.left = `${svgRect.left}px`;
  infoBox.style.top = `${svgRect.bottom + 10}px`;

  infoBox.style.display = "block";
};

const hideInfo = () => {
  infoBox.style.display = "none";
};

fetchData();
