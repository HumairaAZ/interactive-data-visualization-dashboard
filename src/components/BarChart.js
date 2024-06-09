import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import debounce from 'lodash.debounce';

const BarChart = () => {
  const [data, setData] = useState([]);
  const dataset = 'temperature';
  const cities = ['London', 'New York', 'Tokyo', 'Paris', 'Berlin', 'Moscow', 'Sydney', 'Mumbai', 'Shanghai', 'Cairo', 'Dubai', 'Beijing', 'Los Angeles', 'Chicago', 'Houston', 'Toronto', 'Rome', 'Madrid', 'Barcelona', 'Vienna'];
  const svgRef = useRef();

  const fetchWeatherData = useCallback(debounce(async () => {
    const apiKey = '763df8089caadc2bb3a7a2b6ec384a79'; // Replace with your OpenWeatherMap API key
    try {
      const results = await Promise.all(cities.map(city =>
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
          .then(response => response.json())
          .then(data => ({
            name: data.name,
            value: dataset === 'temperature' ? data.main.temp :
                   dataset === 'humidity' ? data.main.humidity :
                   data.wind.speed
          }))
      ));
      setData(results);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }, 300), []);

  useEffect(() => {
    setData([]); // Reset data when cities change
    fetchWeatherData();
  }, [fetchWeatherData]);

  useEffect(() => {
    if (data.length === 0) return;

    const width = svgRef.current.clientWidth;
    const height = 500;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .classed('border border-gray-300', true)
      .call(d3.zoom().on('zoom', (event) => {
        svg.attr('transform', event.transform);
      }));

    const xScale = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([0, width])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .range([height, 0]);

    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute");

    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => xScale(d.name))
      .attr('y', d => yScale(0))
      .attr('width', xScale.bandwidth())
      .attr('height', 0)
      .attr('fill', 'url(#gradient)')
      .attr('stroke', '#2d3748')
      .attr('stroke-width', 1)
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('class', 'shadow-md')
      .on('mouseover', (event, d) => {
        tooltip.transition()
          .duration(200)
          .style('opacity', .9);
        tooltip.html(`City: ${d.name}<br>${dataset.charAt(0).toUpperCase() + dataset.slice(1)}: ${d.value}`)
          .style('left', (event.pageX + 5) + 'px')
          .style('top', (event.pageY - 28) + 'px');
        d3.select(event.currentTarget).transition().duration(200).attr('fill', '#ffed4a');
      })
      .on('mouseout', (event, d) => {
        tooltip.transition()
          .duration(500)
          .style('opacity', 0);
        d3.select(event.currentTarget).transition().duration(500).attr('fill', 'url(#gradient)');
      });

    svg.selectAll('rect')
      .transition()
      .duration(800)
      .attr('y', d => yScale(d.value))
      .attr('height', d => height - yScale(d.value))
      .delay((d, i) => i * 100);

    svg.append('g')
      .attr('transform', 'translate(0,0)')
      .call(d3.axisLeft(yScale));

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("y", 0)
      .attr("x", 9)
      .attr("dy", ".35em")
      .attr("transform", "rotate(45)")
      .style("text-anchor", "start");

    // Append gradient definition
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");
    
    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#3490dc")
      .attr("stop-opacity", 1);
    
    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#6574cd")
      .attr("stop-opacity", 1);

  }, [data]);

  return (
    <div className="container mx-auto p-4">
      <svg ref={svgRef} className="w-full"></svg>
    </div>
  );
};

export default BarChart;
