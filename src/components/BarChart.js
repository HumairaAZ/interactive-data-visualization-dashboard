import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { io } from 'socket.io-client';

const BarChart = ({ initialData }) => {
  const [data, setData] = useState(initialData);
  const svgRef = useRef();

  useEffect(() => {
    const socket = io('http://localhost:4000'); // Replace with your WebSocket server URL
    socket.on('data', (newData) => {
      setData(newData);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const svg = d3.select(svgRef.current)
      .attr('width', 500)
      .attr('height', 500)
      .style('border', '1px solid black')
      .call(d3.zoom().on('zoom', (event) => {
        svg.attr('transform', event.transform);
      }));

    const xScale = d3.scaleBand()
      .domain(data.map((d, i) => i))
      .range([0, 500])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data)])
      .range([500, 0]);

    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d, i) => xScale(i))
      .attr('y', d => yScale(d))
      .attr('width', xScale.bandwidth())
      .attr('height', d => 500 - yScale(d))
      .attr('fill', 'blue');

    svg.append('g')
      .call(d3.axisLeft(yScale));

    svg.append('g')
      .attr('transform', 'translate(0,500)')
      .call(d3.axisBottom(xScale));
  }, [data]);

  const handleFilterChange = (e) => {
    const filterValue = e.target.value;
    const filteredData = initialData.filter(d => d >= filterValue);
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
