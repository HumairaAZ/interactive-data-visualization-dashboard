import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const BarChart = () => {
  const [data, setData] = useState([]);
  const svgRef = useRef();

  useEffect(() => {
    // Fetch data from COVID-19 API
    fetch('https://api.covid19api.com/summary')
      .then(response => response.json())
      .then(data => {
        const countriesData = data.Countries.map(country => ({
          name: country.Country,
          totalCases: country.TotalConfirmed
        })).slice(0, 10); // Taking top 10 countries for simplicity
        setData(countriesData);
      });
  }, []);

  useEffect(() => {
    if (data.length === 0) return;

    const svg = d3.select(svgRef.current)
      .attr('width', 800)
      .attr('height', 500)
      .style('border', '1px solid black')
      .call(d3.zoom().on('zoom', (event) => {
        svg.attr('transform', event.transform);
      }));

    const xScale = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([0, 800])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.totalCases)])
      .range([500, 0]);

    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => xScale(d.name))
      .attr('y', d => yScale(d.totalCases))
      .attr('width', xScale.bandwidth())
      .attr('height', d => 500 - yScale(d.totalCases))
      .attr('fill', 'blue');

    svg.append('g')
      .attr('transform', 'translate(0,0)')
      .call(d3.axisLeft(yScale));

    svg.append('g')
      .attr('transform', 'translate(0,500)')
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("y", 0)
      .attr("x", 9)
      .attr("dy", ".35em")
      .attr(
