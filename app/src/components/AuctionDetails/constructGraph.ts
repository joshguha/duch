import * as d3 from "d3";
import { MutableRefObject } from "react";

function clearNode(node: SVGSVGElement) {
  while (node.firstChild) {
    node.removeChild(node.lastChild as ChildNode);
  }
}

export const constructGraph = (
  graph: MutableRefObject<SVGSVGElement | null>,
  dimensions: [number, number],
  data: { date: number; value: number }[]
) => {
  if (!graph.current) return;

  // Reset svg
  clearNode(graph.current as SVGSVGElement);

  // set the margins of the graph
  const MARGINS = {
    top: 20,
    right: 30,
    bottom: 30,
    left: 50,
  };

  // Set WIDTH and HEIGHT
  const WIDTH = dimensions[0] - MARGINS.left - MARGINS.right;
  const HEIGHT = dimensions[1] - MARGINS.top - MARGINS.bottom;

  // append the svg object to the body of the page
  const svg = d3
    .select(graph.current)
    .attr("width", WIDTH + MARGINS.left + MARGINS.right)
    .attr("height", HEIGHT + MARGINS.top + MARGINS.bottom)
    .attr("color", "#010501")

    .append("g")
    .attr("transform", "translate(" + MARGINS.left + "," + MARGINS.top + ")");

  const domain = [new Date(data[0].date), new Date(data[data.length - 1].date)];

  const maxY = data.reduce(
    (acc, el) => (Number(el.value) > acc ? Number(el.value) : acc),
    0
  );

  //  Add X axis --> it is a date format
  const x = d3.scaleTime().domain(domain).range([0, WIDTH]);

  const xAxis = d3
    .axisBottom(x)
    .tickSizeOuter(0)
    .ticks(3)
    .tickValues([domain[0], domain[1]]) //specify an array here for values
    .tickFormat(d3.timeFormat("%e %b, %H:%m") as any);

  svg
    .append("g")
    .style("font-size", WIDTH < 400 ? "10px" : "15px")
    .style("font-family", "'noigrotesk', Arial, sans-serif")
    .style("color", "white")
    .attr("transform", "translate(0," + HEIGHT + ")")
    .attr("stroke-width", 1)
    .call(xAxis);

  // Add Y axis
  const y = d3.scaleLinear().domain([0, maxY]).range([HEIGHT, 0]);

  const yAxis = d3.axisLeft(y).tickSizeOuter(0);

  svg
    .append("g")
    .style("font-size", WIDTH < 400 ? "10px" : "15px")
    .style("font-family", "'noigrotesk', Arial, sans-serif")
    .style("color", "white")
    .attr("stroke-width", 1)
    .call(yAxis);

  // Add the line
  svg
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "#17ff49")
    .attr("stroke-width", 1.5)
    .attr(
      "d",
      d3
        .line()
        .x(function (d: any) {
          return x(new Date(d.date));
        })
        .y(function (d: any) {
          return y(d.value);
        }) as any
    );
};
