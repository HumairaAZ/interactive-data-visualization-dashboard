import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const BarChart = () => {
  const [data, setData] = useState([]);
  const svgRef = useRef();

  useEffect(() => {
    const apiKey = '763df8089caadc2bb3a7a2b6ec384a79';
    const cities = ['London', 'New York', 'Tokyo', 'Paris', 'Berlin', 'Moscow', 'Sydney', 'Mumbai', 'Shanghai', 'Cairo'];

    Promise.all(cities.map(city =>
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => ({
          name: data.name,
          temperature: data.main.temp
        }))
    )).then(results => setData(results))
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        setData([]);
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
      .domain([0, d3.max(data, d => d.temperature)])
      .range([500, 0]);

    // Tooltip div
    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px");

    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => xScale(d.name))
      .attr('y', d => yScale(0))
      .attr('width', xScale.bandwidth())
      .attr('height', 0)
      .attr('fill', 'blue')
      .on('mouseover', (event, d) => {
        tooltip.transition()
          .duration(200)
          .style('opacity', .9);
        tooltip.html(`City: ${d.name}<br>Temperature: ${d.temperature}°C`)
          .style('left', (event.pageX + 5) + 'px')
          .style('top', (event.pageY - 28) + 'px');
        d3.select(event.currentTarget).transition().duration(200).attr('fill', 'orange');
      })
      .on('mouseout', (event, d) => {
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
        d3.select(event.currentTarget).transition().duration(500).attr('fill', 'blue');
      });

    svg.selectAll('rect')
      .transition()
      .duration(800)
      .attr('y', d => yScale(d.temperature))
      .attr('height', d => 500 - yScale(d.temperature))
      .delay((d, i) => i * 100);

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
      .attr("transform", "rotate(45)")
      .style("text-anchor", "start");
  }, [data]);

  const handleFilterChange = (e) => {
    const filterValue = e.target.value;
    const filteredData = data.filter(d => d.temperature >= filterValue);
    setData(filteredData);
  };

  return (
    <div>
      <div>
        <label>Filter data greater than:
          <input type="number" onChange={handleFilterChange} />
        </label>
      </div>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default BarChart;
