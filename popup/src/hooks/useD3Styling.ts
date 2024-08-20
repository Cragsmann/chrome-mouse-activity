import { useEffect } from "react";
import * as d3 from "d3";
import { MouseTimeData } from "../Popup";

const useD3Styling = (data: MouseTimeData[]) => {
  useEffect(() => {
    if (data.length === 0) return;

    // Set up chart dimensions
    const width = 100 + 50 * data.length;
    const height = 200;
    const margin = { top: 20, right: 30, bottom: 60, left: 40 }; // Increased bottom margin for staggered labels

    // Remove the existing svg element if it exists
    d3.select(".d3-chart").remove();

    // Create the SVG element
    const svg = d3
      .select(".chart-container")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("class", "d3-chart");

    // Create scales
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.hostname))
      .range([margin.left, width - margin.right])
      .padding(0.4); // Increased padding for smaller bars

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.timeSpent) || 0])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Create axes
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(0)") // Keep text horizontal
      .style("text-anchor", "middle") // Center-align the text under bars
      .attr("dy", (_, i) => (i % 2 === 0 ? "1.2em" : "2.4em")); // Stagger the text position vertically

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    // Create bars
    svg
      .append("g")
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", (d) => x(d.hostname)!)
      .attr("y", (d) => y(d.timeSpent))
      .attr("height", (d) => y(0) - y(d.timeSpent))
      .attr("width", x.bandwidth()) // Use bandwidth calculated from new padding
      .attr("fill", "steelblue");
  }, [data]); // Update the chart whenever data changes

  return null;
};

export default useD3Styling;
