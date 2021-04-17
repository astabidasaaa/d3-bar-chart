const width = 800,
height = 400,
barWidth = width / 275,
padding = 50,
margin = 4;

const svgContainer = d3.
select("#dataVis").
append("svg").
attr("width", width + padding + 20).
attr("height", height + padding);
// .style('border', '1px solid black');

const tooltip = d3.
select("#dataVis").
append("div").
attr("id", "tooltip").
style("opacity", 0);

d3.json(
"https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json",
function (e, data) {
  svgContainer.
  append("text").
  attr("transform", "rotate(-90)").
  attr("x", -190).
  attr("y", 80).
  style("font-size", "0.9rem").
  text("Gross Domestic Product");

  svgContainer.
  append("text").
  attr("x", width / 2 + 35).
  attr("y", height + 45).
  style("font-size", "0.8rem").
  text("More Information: http://www.bea.gov/national/pdf/nipaguid.pdf").
  attr("class", "info");

  const GDP = data.data.map((val, i) => {
    // console.log(val[1]);
    return val[1];
  });

  const years = data.data.map((val, i) => {
    const year = val[0].substr(0, 4);
    const month = val[0].substr(5, 2);

    let quarter;

    if (month === "01") {
      quarter = "Q1";
    } else if (month === "04") {
      quarter = "Q2";
    } else if (month === "07") {
      quarter = "Q3";
    } else if (month === "10") {
      quarter = "Q4";
    }

    return year + " " + quarter;
  });

  const yearsDate = data.data.map((val, i) => {
    return new Date(val[0]);
  });

  // console.log(yearsDate);

  const xMax = new Date(d3.max(yearsDate));
  xMax.setMonth(xMax.getMonth() + 3);
  const xScale = d3.
  scaleTime().
  domain([d3.min(yearsDate), xMax]).
  range([0, width]);

  const xAxis = d3.axisBottom().scale(xScale);

  const yScale = d3.
  scaleLinear().
  domain([0, d3.max(GDP) + 200]).
  range([height, 10]);

  const yAxis = d3.axisLeft(yScale);

  svgContainer.
  selectAll("rect").
  data(GDP).
  enter().
  append("rect").
  attr("data-date", (d, i) => {
    return data.data[i][0];
  }).
  attr("data-gdp", (d, i) => {
    return data.data[i][1];
  }).
  attr("x", (d, i) => {
    return i * barWidth + padding;
  }).
  attr("y", (d, i) => {
    return yScale(d);
  }).
  attr("width", barWidth).
  attr("height", (d, i) => {
    return height - yScale(d);
  }).
  attr("class", "bar").
  style("fill", "#28d7b8").
  on("mouseover", (d, i) => {
    tooltip.
    attr("data-date", data.data[i][0]).
    style("top", height + "px").
    style("left", i * barWidth + margin + "px").
    html(
    years[i] +
    "<br>" +
    "$" +
    GDP[i].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, "$1,") +
    " Billion").

    style("transform", (d, idx) => {
      if (i <= GDP.length * 2 / 3) {
        return "translateX(120px)";
      } else {
        return "translateX(-120px)";
      }
    });

    tooltip.transition().duration(100).style("opacity", 0.9);

    svgContainer.selectAll("rect").style("fill", (d, idx) => {
      if (i === idx) {
        return "#D72847";
      } else {
        return "#84e8d6";
      }
    });
  }).
  on("mouseout", (d, i) => {
    tooltip.transition().duration(100).style("opacity", 0);
    svgContainer.selectAll("rect").style("fill", "#28d7b8");
  });

  svgContainer.
  append("g").
  attr("transform", "translate(" + padding + "," + height + ")").
  attr("id", "x-axis").
  call(xAxis);

  svgContainer.
  append("g").
  attr("transform", "translate(" + padding + "," + 0 + ")").
  attr("id", "y-axis").
  call(yAxis);
});