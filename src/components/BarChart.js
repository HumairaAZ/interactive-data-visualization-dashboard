import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import debounce from 'lodash.debounce';

const BarChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortType, setSortType] = useState('default');
  const [filterType, setFilterType] = useState('temperature');
  const cities = ['London', 'New York', 'Tokyo', 'Paris', 'Berlin', 'Moscow', 'Sydney', 'Mumbai', 'Shanghai', 'Cairo'];
  const svgRef = useRef();

  const fetchWeatherData = useCallback(debounce(async () => {
    const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your OpenWeatherMap API key
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.all(cities.map(city =>
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
          .then(response => response.json())
          .then(data => ({
            name: data.name,
            temperature: data.main.temp,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed
          }))
      ));
      setData(results);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, 300), []);

  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  useEffect(() => {
    if (data.length === 0 || loading || error) return;

    const sortedData = [...data];
    if (sortType === 'asc') {
      sortedData.sort((a, b) => a[filterType] - b[filterType]);
    } else if (sortType === 'desc') {
      sortedData.sort((a, b) => b[filterType] - a[filterType]);
    }

    const width = svgRef.current.clientWidth;
    const height = 500;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .classed('border border-gray-300 rounded-lg shadow-lg', true)
      .call(d3.zoom().on('zoom', (event) => {
        svg.attr('transform', event.transform);
      }));

    const xScale = d3.scaleBand()
      .domain(sortedData.map(d => d.name))
      .range([0, width])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(sortedData, d => d[filterType])])
      .range([height, 0]);

    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip bg-white border border-gray-300 p-2 rounded shadow-lg")
      .style("opacity", 0)
      .style("position", "absolute");

    svg.selectAll('rect')
      .data(sortedData)
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
        tooltip.html(`City: ${d.name}<br>${filterType.charAt(0).toUpperCase() + filterType.slice(1)}: ${d[filterType]}`)
          .style('left', `${Math.min(event.pageX + 10, window.innerWidth - 150)}px`)
          .style('top', `${event.pageY - 28}px`);
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
      .attr('y', d => yScale(d[filterType]))
      .attr('height', d => height - yScale(d[filterType]))
      .delay((d, i) => i * 100);

    svg.append('g')
      .attr('transform', 'translate(0,0)')
      .call(d3.axisLeft(yScale).ticks(5).tickSizeOuter(0));

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickSizeOuter(0))
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

  }, [data, loading, error, sortType, filterType]);

  const handleSortChange = (e) => {
    setSortType(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="my-4 flex justify-between items-center">
        <div>
          <label className="block text-gray-700 mb-2">Sort by:</label>
          <select
            value={sortType}
            onChange={handleSortChange}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="default">Default</option>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Filter by:</label>
          <select
            value={filterType}
            onChange={handleFilterChange}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="temperature">Temperature</option>
            <option value="humidity">Humidity</option>
            <option value="windSpeed">Wind Speed</option>
          </select>
        </div>
      </div>
      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}
      <svg ref={svgRef} className="w-full"></svg>
    </div>
  );
};

export default BarChart;
