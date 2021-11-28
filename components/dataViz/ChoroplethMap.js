import { useEffect, useRef } from "react";
import styles from "../../styles/map.module.css";
import numberWithCommas from "../numberWithCommas";
import * as d3 from "d3";

function getBaseLog(x, y) {
  return Math.log(y) / Math.log(x);
}

const ChoroplethMap = ({ data, locations, covid }) => {
  const ChoroplethMap = useRef();
  useEffect(() => {
    const w = 900;
    const h = 500;

    console.log(locations);
    console.log(data.features);
    console.log(covid);
    const projection = d3
      .geoMercator()
      .scale(150)
      .center([0, 35])
      .translate([w / 2, h / 2]);

    //colour scale
    const colourScale = d3
      .scaleQuantize()
      .domain([
        0,
        getBaseLog(
          2,
          d3.max(locations, (d) => d.new_cases_smoothed)
        ),
      ])
      .range([
        "#fff5f0",
        "#fee3d6",
        "#fdc9b4",
        "#fcaa8e",
        "#fc8a6b",
        "#f9694c",
        "#ef4533",
        "#d92723",
        "#bb151a",
        "#970b13",
        "#67000d",
      ]);

    //set up map
    const svg = d3
      .select(ChoroplethMap.current)
      .attr("width", w + 50)
      .attr("height", h + 50)
      .attr("class", "ChoroplethMap");

    //tooltip
    const tooltip = d3
      .select("#vis__container")
      .append("div")
      .attr("class", "tooltip")
      .style("display", "none")
      .style("position", "absolute")
      .style("background-color", "#333333")
      .style("border", "solid 2px black")
      .style("border-radius", "8px")
      .style("top", "0")
      .style("left", "0")
      .style("padding", "1rem")
      .style("box-shadow", "0 4px 8px 0 rgba(0, 0, 0, 0.2)");

    const mouseover = function (d) {
      tooltip.style("display", "block");
      d3.select(this)
        .style("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", 1);
    };

    const mousemove = (i, d) => {
      console.log(d);
      console.log(covid[d.id]);
      const newCase =
        covid[d.id] && covid[d.id].new_cases_smoothed != null
          ? Math.floor(covid[d.id].new_cases_smoothed)
          : "no data";
      tooltip
        .html(`${d.properties.name} <br> cases: ${newCase}`)
        .style("left", `${i.pageX + 30}px`)
        .style("top", `${i.pageY - 100}px`);
    };

    const mouseleave = function (d) {
      tooltip.style("display", "none");

      d3.select(this).style("stroke", "none").style("opacity", 1);
    };

    //draw choropleth
    svg
      .append("g")
      .selectAll("path")
      .data(data.features)
      .enter()
      // draw each country
      .append("path")
      .attr("d", d3.geoPath().projection(projection))
      .style("stroke", "gray")
      .style("stroke-width", "0.5px")
      .attr("fill", (d, i) => {
        if (covid[d.id]) {
          return colourScale(getBaseLog(2, covid[d.id].new_cases_smoothed));
        } else {
          return "white";
        }
      })
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);

    //create legend
    let legendData = [];
    for (let i = 1; i <= 11; i++) {
      const num = Math.floor(
        Math.pow(
          2,
          i *
            (getBaseLog(
              2,
              d3.max(locations, (d) => d.new_cases_smoothed)
            ) /
              11)
        )
      );
      const digits = num.toString().length;
      console.log(digits);
      const roundNum = parseInt(
        "5".concat("0".repeat(digits > 2 && digits - 2))
      );
      // rounds based on high number is
      const newNum = Math.round(num / roundNum) * roundNum;

      legendData.push(newNum);
    }
    console.log(legendData);

    const legendX = d3.scalePoint().domain(legendData).range([0, 800]);

    const legendAxis = d3.axisTop(legendX).ticks(11);

    legendAxis;
    const legend = svg
      .append("g")
      .attr("id", "legend")
      .attr("transform", "translate(120,500)")
      .call(legendAxis)
      .selectAll("rect")
      .data(legendData)
      .enter()
      .append("rect")
      .attr("x", (d) => legendX(d) - 80)
      .attr("y", 1)
      .attr("width", (d) => 80)
      .attr("height", (d) => 30)
      .style("fill", (d) => colourScale(getBaseLog(2, d)))
      .style("outline", "1px solid");
  }, []);

  return (
    <div className={styles.ChoroplethMap__container} id="vis__container">
      <h1>New Cases</h1>
      <svg ref={ChoroplethMap}></svg>
    </div>
  );
};

export default ChoroplethMap;
