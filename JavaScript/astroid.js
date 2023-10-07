const svgPie = d3.select("#pieChart");
const radius = Math.min(+svgPie.attr("width"), +svgPie.attr("height")) / 2;
const gPie = svgPie.append("g").attr("transform", `translate(${+svgPie.attr("width") / 2}, ${+svgPie.attr("height") / 2})`);
const API_KEY = "mqVBkEDJKwEtL2xVKR1mBAYdWCvU4qdOZgx2LNbJ";

document.addEventListener("DOMContentLoaded", init);

function init() {
    const dateInput = document.getElementById("dateInput");
    const defaultDate = getCurrentDate();
    dateInput.value = defaultDate;

    dateInput.addEventListener('change', () => fetchDataPie(dateInput.value));
    fetchDataPie(defaultDate);

    document.getElementById("dateForm").addEventListener("submit", onFormSubmit);
    fetchDataLineChart(defaultDate, addDays(defaultDate, 7));
}

function onFormSubmit(event) {
    event.preventDefault();
    const startDate = document.getElementById("startDate").value;
    fetchDataLineChart(startDate, addDays(startDate, 7));
}

function getCurrentDate() {
    return new Date().toISOString().split('T')[0];
}

function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString().split("T")[0];
}

function fetchDataPie(date) {
    const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${date}&end_date=${date}&api_key=${API_KEY}`;
    fetch(url).then(r => r.json()).then(d => renderPieChart(categorizeAsteroids(d.near_earth_objects[date])));
}

function fetchDataLineChart(startDate, endDate) {
    const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${API_KEY}`;
    fetch(url).then(r => r.json()).then(data => processLineChartData(data));
}

function categorizeAsteroids(asteroids) {
    return asteroids.reduce((acc, a) => {
        const dia = (a.estimated_diameter.meters.estimated_diameter_min + a.estimated_diameter.meters.estimated_diameter_max) / 2;
        dia < 10 ? acc.small++ : dia < 50 ? acc.medium++ : acc.large++;
        return acc;
    }, { small: 0, medium: 0, large: 0 });
}

function renderPieChart(data) {
    const arcGen = d3.arc().innerRadius(0).outerRadius(radius);
    const arcs = d3.pie().value(d => d[1])(Object.entries(data));
    drawPieChartPaths(arcs, arcGen);
    drawPieChartTexts(arcs, arcGen);
}

function drawPieChartPaths(arcs, arcGen) {
    gPie.selectAll("path").data(arcs).join("path")
        .attr("d", arcGen)
        .attr("fill", (_, i) => d3.schemeCategory10[i]);
}

function drawPieChartTexts(arcs, arcGen) {
    gPie.selectAll("text").data(arcs).join("text")
        .attr("transform", d => `translate(${arcGen.centroid(d)})`)
        .attr("text-anchor", "middle")
        .text(d => `${d.data[0]}: ${d.data[1]}`);
}

function processLineChartData(data) {
  const asteroids = extractAsteroidData(data);
  renderLineChart(asteroids);
}

function extractAsteroidData(data) {
  const asteroids = [];
  for (let date in data.near_earth_objects) {
      const parseTime = d3.timeParse("%Y-%m-%d");
      asteroids.push({
          date: parseTime(date),
          count: data.near_earth_objects[date].length,
      });
  }
  return asteroids.sort((a, b) => a.date - b.date);
}

function renderLineChart(asteroids) {
  const svg = setupSVG();
  const { xScale, yScale } = setupScales(asteroids, svg);
  const line = setupLine(xScale, yScale);

  svg.selectAll("*").remove();
  const g = svg.append("g").attr("transform", `translate(${svg.margin.left},${svg.margin.top})`);
  
  drawChartPath(g, asteroids, line);
  drawChartDots(g, asteroids, xScale, yScale);
  drawAxes(g, xScale, yScale, svg);
}

function setupSVG() {
  const svg = d3.select("#neoGraph");
  svg.margin = { top: 50, right: 50, bottom: 80, left: 80 };
  svg.width = +svg.attr("width") - svg.margin.left - svg.margin.right;
  svg.height = +svg.attr("height") - svg.margin.top - svg.margin.bottom;
  return svg;
}

function setupScales(asteroids, svg) {
  const xScale = d3.scaleTime().domain(d3.extent(asteroids, d => d.date)).range([0, svg.width]);
  const yScale = d3.scaleLinear().domain([0, d3.max(asteroids, d => d.count)]).range([svg.height, 0]);
  return { xScale, yScale };
}

function setupLine(xScale, yScale) {
  return d3.line().x(d => xScale(d.date)).y(d => yScale(d.count));
}

function drawChartPath(g, asteroids, line) {
  g.append("path").datum(asteroids).attr("fill", "none").attr("class", "linePath")
    .attr("stroke-linejoin", "round").attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5).attr("d", line);
}

function drawChartDots(g, asteroids, xScale, yScale) {
  const maxCount = d3.max(asteroids, d => d.count);
  const minCount = d3.min(asteroids, d => d.count);
  const tooltip = setupTooltip();

  g.selectAll(".dot")
      .data(asteroids)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", d => xScale(d.date))
      .attr("cy", d => yScale(d.count))
      .attr("r", 3.5)
      .attr("fill", d => getDotColor(d, maxCount, minCount))
      .on("mouseover", (event, d) => onDotMouseOver(event, d, tooltip))
      .on("mouseout", event => onDotMouseOut(event, tooltip))
}

function setupTooltip() {
  return d3.select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
}

function getDotColor(d, maxCount, minCount) {
  if (d.count === maxCount) {
      return "red";
  } else if (d.count === minCount) {
      return "lawngreen";
  }
  return "steelblue";
}

function onDotMouseOver(event, d, tooltip) {
  d3.select(event.currentTarget).attr("r", 5);
  tooltip.transition().duration(200).style("opacity", 0.9);
  tooltip.html("Date: " + d.date + "<br/>Asteroids: " + d.count)
      .style("left", event.pageX + 5 + "px")
      .style("top", event.pageY - 28 + "px");
}

function onDotMouseOut(event, tooltip) {
  d3.select(event.currentTarget).attr("r", 3.5);
  tooltip.transition().duration(500).style("opacity", 0);
}

function drawAxes(g, xScale, yScale, svg) {
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  g.append("g")
      .attr("transform", "translate(0," + svg.height + ")")
      .call(xAxis);

  g.append("text")
      .attr("class", "label")
      .attr("x", svg.width / 2)
      .attr("y", svg.height + 50)
      .style("text-anchor", "middle")
      .text("Date");

  g.append("g").call(yAxis);

  g.append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", -50)
      .attr("x", 0 - svg.height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Number of Asteroids");
}

init();

