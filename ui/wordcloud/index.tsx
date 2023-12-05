"use client";

import React, { useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";
import d3cloud from "d3-cloud";
import * as d3 from "d3";

export default function WordCloud({ words }) {
  const reference = useRef();

  useEffect(() => {
    let width = typeof window !== "undefined" ? window.innerWidth - 200 : 1000;

    if (reference.current) {
      (reference.current as any).innerHTML = "";
      let fill = d3
        .scaleSequential() // Initialize the color scale, here we are using a sequential colorscale
        .domain([10, 100]) //It accepts values within the range [10,100] and translate them to the equivelent colors.
        .interpolator(d3.interpolateRainbow); // with interpolateRainbow color pallete.
      let xScale = d3
        .scaleLinear() //This scale will help us translate any count range into a range of 10-100,
        .domain([
          0,
          d3.max(words as [], function (d) {
            //we will use this for specifying fonts and colors
            return (d as any).count;
          }), // The domain is 0 to the maximum count value in the given dataset.
        ])
        .range([10, 50]); //The domain is mapped to a [10,100] range.
      let svg = d3.select(reference.current); //Select the SVG element with the unique ID we specified earlier

      const draw = function (_words) {
        svg
          .attr("width", layout.size()[0]) //Set the width of the SVG to be equal to the width of the layout object
          .attr("height", layout.size()[1]) //Set the height of the SVG to be equal to the height of the layout object
          .append("g") //Append a group svg element "g" to contain the words.
          .attr(
            "transform",
            "translate(" +
              layout.size()[0] / 2 +
              "," +
              layout.size()[1] / 2 +
              ")",
          ) //Set the center location of the word cloud
          .selectAll("text") //Select all text objects (there are none at this point)
          .data(_words) //Load dataset
          .enter() //Create a text object for each data point
          .append("text") //Append a text object for each word to the "g" object we created earlier
          .style("font-size", (d) => xScale((d as any).count) + "px") //Specify the font size, similar to what we did earlier.
          .style("font-family", "Impact") //Specify font size.
          .attr("text-anchor", "middle") //text-anchor:middle => the x,y values will be of the center of the text.
          .attr(
            "transform",
            (d) =>
              `translate(${[(d as any).x, (d as any).y]})rotate(${
                (d as any).rotate
              })`,
          ) //Move the word to its x,y location and rotate it if rotation is specified.
          .style("fill", function (d) {
            return fill(xScale((d as any).count));
          }) //Fill the word with a corrosponding color.
          .text((d) => (d as any).normal); //Add the text of the word.
      };
      let height = 600; //Specify the height of the Word Cloud
      var layout = d3cloud() //Here we are calling the d3cloud library to initialize our layout
        .size([width, height]) //we specify the height and width of our word cloud.
        .words(words) //Load the dataset
        .padding(10) //Add padding 5 between words.
        .rotate(function () {
          return 0;
        }) //Specify the rotation angle, here it is 0. Hence, no rotation.
        .font("Impact") //Fontname
        .fontSize((d) => xScale(d.count)) //Font size of each word (notice that we use xScale for mapping)
        .on("end", draw); //Call the Draw function after the layout is initialized.
      layout.start();
    }
  }, [words]);

  return <svg className="mx-auto" ref={reference}></svg>;
}
