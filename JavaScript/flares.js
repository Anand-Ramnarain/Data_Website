const apiKey = "mqVBkEDJKwEtL2xVKR1mBAYdWCvU4qdOZgx2LNbJ";

const API_URL =
  "https://api.nasa.gov/insight_weather/?api_key="+apiKey+"&feedtype=json&ver=1.0";

renderGraph(2022, 1, 12);

async function fetchData(startDate, endDate) {
  const baseURL =
    `https://api.nasa.gov/DONKI/FLR?startDate=${startDate}&endDate=${endDate}&api_key=`+apiKey;

  const response = await fetch(baseURL);
  if (response.ok) {
    return response.json();
  } else {
    console.error("Failed to fetch data from DONKI API.");
    return [];
  }
}

function monthNumberToName(month) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthNames[month - 1];
}

async function getFlareCountsForMonths(year, startMonth, endMonth) {
  let counts = [];
  for (let month = startMonth; month <= endMonth; month++) {
    const daysInMonth = new Date(year, month, 0).getDate();
    const startDate = `${year}-${month}-01`;
    const endDate = `${year}-${month}-${daysInMonth}`;

    const flares = await fetchData(startDate, endDate);
    counts.push({
      month: `${monthNumberToName(month)} ${year}`,
      count: flares.length,
    });
  }
  return counts;
  
}


async function renderGraph(year, startMonth, endMonth) {
  const flareCounts = await getFlareCountsForMonths(year, startMonth, endMonth);

  const width = 600;
  const height = 600;
  const margin = { top: 20, right: 20, bottom: 95, left: 60 };

  const x = d3
    .scaleBand()
    .range([margin.left, width - margin.right])
    .padding(0.1);
  const y = d3.scaleLinear().range([height - margin.bottom, margin.top]);

  const svg = d3
    .select("#chart-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  x.domain(flareCounts.map((d) => d.month));
  y.domain([0, d3.max(flareCounts, (d) => d.count)]).nice();

  const bars = svg
    .append("g")
    .selectAll("rect")
    .data(flareCounts)
    .enter()
    .append("rect")
    .attr("x", (d) => x(d.month))
    .attr("y", (d) => y(d.count))
    .attr("height", (d) => y(0) - y(d.count))
    .attr("width", x.bandwidth())
    .attr("class", (d) =>{
      if(d.month === "June 2022") return "juneBar";
      if(d.month === "December 2022") return "decBar";
    })


  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .attr("text-anchor", "end")
    .attr("dy", "0.5em")
    .attr("dx", "-0.5em");

  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y));

  svg
    .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", 0)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Number of Solar Flares");

  svg
    .append("text")
    .attr("class", "label")
    .attr("transform", `translate(${width / 2} ,${height - 11})`)
    .style("text-anchor", "middle")
    .text("Month and Year");

    bars.on("mouseover",null);
    bars
    .on("mouseover", function (event, d) {
      console.log("Logged data",d);
      console.log("Full data from this:", d3.select(this).datum());

      d3.select("#tooltip")
        .style("left", event.pageX + 10 + "px") 
        .style("top", event.pageY - 10 + "px") 
        .html(`Number of Solar Flares in ${d.month}: ${d.count}`)
        .classed("hidden", false); 
    })
    .on("mousemove", function (event, d) {
      
      d3.select("#tooltip")
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 10 + "px");
    })
    .on("mouseout", function () {
   
      d3.select("#tooltip").classed("hidden", true);
    });
}

const url =
  "https://api.nasa.gov/DONKI/FLR?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&api_key=" +
  apiKey;

function getDONKIUrlForMonth(year, month) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  const formattedStartDate = startDate.toISOString().split("T")[0];
  const formattedEndDate = endDate.toISOString().split("T")[0];

  return (
    `https://api.nasa.gov/DONKI/FLR?startDate=${formattedStartDate}&endDate=${formattedEndDate}&api_key=` +
    apiKey
  );
}

function fetchAndRenderData() {
  const selectedYear = +document.getElementById("year").value;
  const selectedMonth = +document.getElementById("month").value;
  const selectedUrl = getDONKIUrlForMonth(selectedYear, selectedMonth);

  fetch(selectedUrl)
    .then((response) => response.json())
    .then((data) => {
      createPieChart(processData(data));
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

const defaultYear = 2022;
const defaultMonth = 1;
const defaultUrl = getDONKIUrlForMonth(defaultYear, defaultMonth);

fetch(defaultUrl)
  .then((response) => response.json())
  .then((data) => {
    createPieChart(processData(data));
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

function processData(data) {
  const flareTypes = {};

  data.forEach((flare) => {
    const classification = flare.classType.charAt(0);
    if (!flareTypes[classification]) {
      flareTypes[classification] = 0;
    }
    flareTypes[classification]++;
  });

  return Object.entries(flareTypes).map(([key, value]) => {
    return { type: key, count: value };
  });
}

function getTotalCount(data) {
  return data.reduce((acc, curr) => acc + curr.count, 0);
}

function createPieChart(data) {
  const container = d3.select("#pieChartContainer");
  // Clear any previous SVGs
  container.selectAll("svg").remove();

  const width = 400;
  const height = 400;
  const radius = Math.min(width, height) / 2;

  const total = getTotalCount(data);

  const svg = container
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const pie = d3.pie().value((d) => d.count);
  const arc = d3.arc().outerRadius(radius).innerRadius(0);

  const g = svg
    .selectAll(".arc")
    .data(pie(data))
    .enter()
    .append("g")
    .attr("class", "arc");

  g.append("path")
    .attr("d", arc)
    .style("fill", (d) => color(d.data.type));

  g.append("text")
    .attr("transform", (d) => `translate(${arc.centroid(d)})`)
    .attr("dy", ".35em")
    .text((d) => {
      const percentage = (d.data.count / total) * 100;
      return `${d.data.type}: ${percentage.toFixed(2)}%`;
    });
}
