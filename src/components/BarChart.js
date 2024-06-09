import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import debounce from 'lodash.debounce';

const BarChart = () => {
  const [data, setData] = useState([]);
  const [dataset, setDataset] = useState('temperature');
  const [selectedCities, setSelectedCities] = useState([
    'London', 'New York', 'Tokyo', 'Paris', 'Berlin', 'Moscow', 'Sydney', 'Mumbai', 'Shanghai', 'Cairo'
  ]);
  const [page, setPage] = useState(1);
  const svgRef = useRef();
  const pageSize = 5;

  const fetchWeatherData = useCallback(debounce(async (cities) => {

    const apiKey = '763df8089caadc2bb3a7a2b6ec384a79';
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
      setData(prevData => [...prevData, ...results]);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }, 300), [dataset]);

  useEffect(() => {
    setData([]); // Reset data when dataset or cities change
    fetchWeatherData(selectedCities.slice(0, pageSize));
    setPage(1); // Reset to first page
  }, [dataset, selectedCities, fetchWeatherData]);

  useEffect(() => {
    if (data.length === 0) return;

    const svg = d3.select(svgRef.current)
      .attr('width', 800)
      .attr('height', 500)
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
      .attr("class", "tooltip bg-white border border-gray-400 rounded p-2 shadow-lg")
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
      .attr('fill', 'blue')
      .on('mouseover', (event, d) => {
        tooltip.transition()
          .duration(200)
          .style('opacity', .9);
        tooltip.html(`City: ${d.name}<br>${dataset.charAt(0).toUpperCase() + dataset.slice(1)}: ${d.value}`)
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

  const loadMoreData = () => {
    const nextPage = page + 1;
    const nextCities = selectedCities.slice((nextPage - 1) * pageSize, nextPage * pageSize);
    fetchWeatherData(nextCities);
    setPage(nextPage);
  };

  return (
    <div className="container mx-auto">
      <div className="my-4 flex flex-col md:flex-row justify-between items-center">
        <div>
          <label className="block text-gray-700">Select Dataset:
            <select
              value={dataset}
              onChange={handleDatasetChange}
              className="ml-2 p-1 border border-gray-300 rounded"
            >
              <option value="temperature">Temperature</option>
              <option value="humidity">Humidity</option>
              <option value="windSpeed">Wind Speed</option>
            </select>
          </label>
        </div>
        <div>
          <label className="block text-gray-700">Select Cities:
            <select
              multiple
              onChange={handleCityChange}
              className="ml-2 p-1 border border-gray-300 rounded"
              style={{ height: '100px' }}
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
          </label>
        </div>
      </div>
      <svg ref={svgRef}></svg>
      <button
        onClick={loadMoreData}
        className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        Load More Data
      </button>
    </div>
  );
};

export default BarChart;
