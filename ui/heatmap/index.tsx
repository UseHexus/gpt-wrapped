"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const COLORS = [
  "#f7fbff",
  "#deebf7",
  "#c6dbef",
  "#9ecae1",
  "#6baed6",
  "#4292c6",
  "#2171b5",
  "#08519c",
  "#08306b",
];
export default function HeatMap({ data }) {
  const reference = useRef();
  const tooltipRef = useRef();
  const [w, _] = useState(
    typeof window !== "undefined" ? window.innerWidth - 200 : 1000,
  );

  useEffect(() => {
    if (reference.current) {
      let values = [];
      (reference.current as any).innerHTML = "";
      (tooltipRef.current as any).innerHTML = "";
      for (let i in data) {
        let d = new Date(i) as any;
        values.push({
          group: d.getDate().toString(),
          variable: MONTH_NAMES[d.getMonth()],
          value: data[i],
        });
      }

      var margin = { top: 30, right: 30, bottom: 30, left: 30 },
        width = w - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

      // append the svg object to the body of the page
      var svg = d3
        .select(reference.current)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Labels of row and columns
      var myGroups = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
      ];

      var myVars = MONTH_NAMES; // Want to display top to bottom

      // Build X scales and axis:
      var x = d3
        .scaleBand()
        .range([0, width])
        .domain(myGroups.map((e) => e.toString()))
        .padding(0.01);
      svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      // Build X scales and axis:
      var y = d3
        .scaleBand()
        .range([0, height])
        .domain(myVars.map((e) => e.toString()))
        .padding(0.01);
      svg.append("g").call(d3.axisLeft(y));

      // Build color scale
      var myColor = d3
        .scaleLinear() //This scale will help us translate any count range into a range of 10-100,
        .domain([
          0,
          d3.max(values, function (d) {
            //we will use this for specifying fonts and colors
            return (d as any).value;
          }), // The domain is 0 to the maximum count value in the given valuesset.
        ])
        .range([0, 11]); //The domain is mapped to a [10,100] range.

      // create a tooltip
      var tooltip = d3.select(tooltipRef.current);

      // Three function that change the tooltip when user hover / move / leave a cell
      var mouseover = function (d) {
        tooltip.style("opacity", 1);
      };
      var mousemove = function (event, d) {
        tooltip
          .html("Number of conversations on the day: " + d.value)
          .style("left", event.offsetX + 70 + "px")
          .style("top", event.offsetY + "px");
      };
      var mouseleave = function (d) {
        tooltip.style("opacity", 0);
      };

      // add the squares
      svg
        .selectAll()
        .data(values, function (d) {
          return (d as any).group + ":" + (d as any).variable;
        })
        .enter()
        .append("rect")
        .attr("x", function (d) {
          return x((d as any).group);
        })
        .attr("y", function (d) {
          return y((d as any).variable);
        })
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .style("fill", function (d) {
          return COLORS[Math.floor(myColor((d as any).value))];
        })
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);
    }
  }, [data]);

  return (
    <>
      <div className="relative ml-8 ">
        <div className="text-yellow-100" ref={tooltipRef}></div>
        <svg width={w} height={500} className="mx-auto" ref={reference}></svg>
      </div>
    </>
  );
}
