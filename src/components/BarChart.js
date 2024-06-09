import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const BarChart = ({ data }) => {
  const ref = useRef();

  useEffect(() => {
    const svg = d3.select(ref.current)
      .attr('width', 500)
      .attr('height', 500)
      .style('border', '1px solid black');

    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d, i) => i * 50)
      .attr('y', d => 500 - d * 10)
      .attr('width', 40)
      .attr('height', d => d * 10)
      .attr('fill', 'blue');
  }, [data]);

  return <svg ref={ref}></svg>;
};

export default BarChart;
