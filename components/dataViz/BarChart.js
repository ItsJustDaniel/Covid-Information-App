import { useEffect, useRef } from "react";
import * as d3 from "d3";
import styles from "../../styles/statistics.module.css";
import numberWithCommas from "../numberWithCommas";

const BarChart = ({
  data,
  X,
  Y,
  Name,
  Value_Type,
  Value_Category,
  smoothed,
}) => {
  const barChart = useRef();
  useEffect(() => {
    const w = 900;
    const h = 500;
    const margin = { top: 20, right: 30, bottom: 30, left: 30 };
    const barWidth = w / X.length;
    const padding = 60;
    //get years
    const years = X;

    // get values
    const values = Y;

    //set up chart
    const svg = d3
      .select(barChart.current)
      .attr("width", w + 50)
      .attr("height", h + 50)
      .attr("class", "BarChart");
    //set up the scale for the x axis and y axis
    const xScale = d3
      .scaleTime()
      .domain([d3.min(years), d3.max(years)])
      .range([60, w]);

    const yScale = d3
      .scaleLinear()
      .domain([d3.min(values), d3.max(values)])
      .range([0, h]);

    //tooltip
    //circle for linegraph

    const tooltip = d3
      .select("#vis__container")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "#e02626")
      .style("border-radius", "8px")
      .style("top", "0")
      .style("left", "0")
      .style("padding", "1rem")
      .style("box-shadow", "0 4px 8px 0 rgba(0, 0, 0, 0.2)");

    const mouseover = function (d) {
      tooltip.style("opacity", 1);
      smoothed && circle.style("opacity", 1);
      d3.select(this).style("fill", "#e02626").style("opacity", 1);
    };

    const mousemove = (i, d, e) => {
      circle
        .attr("cx", xScale(new Date(d.date)))
        .attr("cy", h - yScale(d[`${Value_Type}_smoothed`]));
      tooltip
        .html(
          `Date: ${d.date} <br> ${Value_Category}: ${numberWithCommas(
            d[Value_Type]
          )} <br>
          ${
            smoothed
              ? `7-day avg: ${numberWithCommas(d[`${Value_Type}_smoothed`])}`
              : ""
          }`
        )
        .style("left", `${i.pageX + 30}px`)
        .style("top", `${i.pageY - 100}px`)
        .attr("data-date", d.date);
    };
    const mouseleave = function (d) {
      tooltip.style("opacity", 0);
      circle.style("opacity", 0);

      d3.select(this).style("fill", "white").style("opacity", 1);
    };

    //create bars
    const bars = svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(new Date(d.date)))
      .attr("y", (d, i) => h - yScale(Y[i]))
      .attr("width", barWidth)
      .attr("height", (d, i) => yScale(Y[i]))
      .attr("fill", "white")
      .attr("class", "bar")
      .style("position", "relative")
      .style("z-index", "-1")
      .attr("data-case", (d, i) => Y[i])
      .attr("data-date", (d) => d.date)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);
    //create line
    if (smoothed) {
      const line = svg
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#e02626")
        .attr("stroke-width", 4)
        .attr(
          "d",
          d3
            .line()
            .x((d, i) => {
              return xScale(new Date(X[i]));
            })
            .y((d, i) => h - yScale(smoothed[i]))
        );
    }

    //line hover
    const circle = svg
      .append("circle")
      .attr("r", 10)
      .attr("class", "circle")
      .attr("fill", "#e02626")
      .style("opacity", "0");

    //create axis
    const formatValue = d3.format(".2s");

    const yAxisScale = d3
      .scaleLinear()
      .domain([0, d3.max(values)])
      .range([h, 0]);

    const xAxis = d3.axisBottom().scale(xScale);
    const yAxis = d3
      .axisLeft(yAxisScale)
      .tickFormat((d) =>
        d3.max(Y) > 1000000 ? formatValue(d) : numberWithCommas(d)
      );

    svg
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${h})`)
      .call(xAxis);

    svg
      .append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(${padding},0)`)
      .call(yAxis);
  }, []);
  return (
    <div className={styles.data__visBlock} id="vis__container">
      <h1>{Name}</h1>
      <svg ref={barChart}></svg>
      <h6 className={styles.data__desc}>
        From{" "}
        <a taget="_blank" href="https://ourworldindata.org/coronavirus-data">
          Our World In Data
        </a>
      </h6>
    </div>
  );
};

export default BarChart;
