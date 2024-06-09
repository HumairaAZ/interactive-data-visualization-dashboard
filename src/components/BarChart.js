import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import debounce from 'lodash.debounce';

const BarChart = () => {
  const [data, setData] = useState([]);
  const [dataset, setDataset] = useState('temperature');
  const [selectedCities, setSelectedCities] = useState([
    'London', 'New York', 'Tokyo', 'Paris', 'Berlin', 'Moscow', 'Sydney', 'Mumbai', 'Shanghai', 'Cairo'
  ]);
  const svgRef = useRef();

  const fetchWeatherData = useCallback(debounce(async (cities) => {
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
  }, 300), [dataset]);

  useEffect(() => {
    setData([]); // Reset data when dataset or cities change
    fetchWeatherData(selectedCities);
  }, [dataset, selectedCities, fetchWeatherData]);

  useEffect(() => {
    if (data.length === 0) return;

    const svg = d3.select(svgRef.current)
      .attr('width', '100%')
      .attr('height', '500')
      .classed('border border-gray-300', true)
      .call(d3.zoom().on('zoom', (event) => {
        svg.attr('transform', event.transform);
      }));

    const xScale = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([0, 800])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .range([500, 0]);

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
      .attr('fill', '#3490dc')
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
        d3.select(event.currentTarget).transition().duration(500).attr('fill', '#3490dc');
      });

    svg.selectAll('rect')
      .transition()
      .duration(800)
      .attr('y', d => yScale(d.value))
      .attr('height', d => 500 - yScale(d.value))
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
  }, [data, dataset]);

  const handleDatasetChange = (e) => {
    setDataset(e.target.value);
  };

  const handleCityChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setSelectedCities(selectedOptions);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="my-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 mb-2">Select Dataset:</label>
          <select
            value={dataset}
            onChange={handleDatasetChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="temperature">Temperature</option>
            <option value="humidity">Humidity</option>
            <option value="windSpeed">Wind Speed</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Select Cities:</label>
          <select
            multiple
            onChange={handleCityChange}
            className="w-full p-2 border border-gray-300 rounded"
            style={{ height: '150px' }}
          >
            <option value="London">London</option>
            <option value="New York">New York</option>
            <option value="Tokyo">Tokyo</option>
            <option value="Paris">Paris</option>
            <option value="Berlin">Berlin</option>
            <option value="Moscow">Moscow</option>
            <option value="Sydney">Sydney</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Shanghai">Shanghai</option>
            <option value="Cairo">Cairo</option>
          </select>
        </div>
      </div>
      <svg ref={svgRef} className="w-full"></svg>
    </div>
  );
};

export default BarChart;
