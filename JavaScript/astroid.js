const API_KEY = "mqVBkEDJKwEtL2xVKR1mBAYdWCvU4qdOZgx2LNbJ";

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("dateForm")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent the form from doing a full page submit

      const startDate = document.getElementById("startDate").value;
      const endDate = addDays(startDate, 7); // Fetching data for the next 7 days from the selected date

      fetchData(startDate, endDate);
    });

  // Optional: Load data for an initial/default date when the page first loads:
  const defaultStartDate = new Date().toISOString().split("T")[0];
  fetchData(defaultStartDate, addDays(defaultStartDate, 7));
});

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result.toISOString().split("T")[0]; // Return date in 'YYYY-MM-DD' format
}

function fetchData(startDate, endDate) {
  const API_URL =`https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=`+API_KEY;

  fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
      const asteroids = [];
      for (let date in data.near_earth_objects) {
        const parseTime = d3.timeParse("%Y-%m-%d");
        asteroids.push({
          date: parseTime(date),
          count: data.near_earth_objects[date].length,
        });
      }

      asteroids.sort((a, b) => a.date - b.date); // Ensure data is sorted by date

      const svg = d3.select("#neoGraph");
      const margin = { top: 50, right: 50, bottom: 80, left: 80 };
      const width = +svg.attr("width") - margin.left - margin.right;
      const height = +svg.attr("height") - margin.top - margin.bottom;

      // Define scales, axes, and line for the D3 plot
      const xScale = d3
        .scaleTime()
        .domain(d3.extent(asteroids, (d) => d.date))
        .range([0, width]);
      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(asteroids, (d) => d.count)])
        .range([height, 0]);

      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

      const line = d3
        .line()
        .x((d) => xScale(d.date))
        .y((d) => yScale(d.count));

      // Clear the SVG before appending new data (especially useful when new data is fetched)
      svg.selectAll("*").remove();

      const maxCount = d3.max(asteroids, d => d.count);
      const minCount = d3.min(asteroids, d => d.count);

      const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      g.append("path")
        .datum(asteroids)
        .attr("fill", "none")
        .attr("class", "linePath")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line);

      // Tooltip for dots
      const tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

        g.selectAll(".dot")
        .data(asteroids)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", (d) => xScale(d.date))
        .attr("cy", (d) => yScale(d.count))
        .attr("r", 3.5)
        .attr("fill", function(d) {
            if (d.count === maxCount) {
                return "red";  // Color for the highest dot
            } else if (d.count === minCount) {
                return "lawngreen"; // Color for the lowest dot
            } else {
                return "steelblue"; // Default color for all other dots
            }
        })
        .on("mouseover", function(event, d) {
            d3.select(this)
                .attr("r", 5);  // Increase the dot radius on hover

            tooltip.transition().duration(200).style("opacity", 0.9);
            tooltip.html("Date: " + d.date + "<br/>Asteroids: " + d.count)
                .style("left", event.pageX + 5 + "px")
                .style("top", event.pageY - 28 + "px");
        })
        .on("mouseout", function(d) {
            d3.select(this)
                .attr("r", 3.5);  // Reset the dot radius

            tooltip.transition().duration(500).style("opacity", 0);
        });

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    g.append("text")
        .attr("class", "label")
        .attr("x", width / 2)
        .attr("y", height + 50)
        .style("text-anchor", "middle")
        .text("Date");

    g.append("g").call(yAxis);
    g.append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", 0 - height / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Number of Asteroids");
});
}
