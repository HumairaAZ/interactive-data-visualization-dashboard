import React from 'react';
import { render } from '@testing-library/react';
import BarChart from './BarChart';
import '@testing-library/jest-dom/extend-expect';

test('renders bar chart', () => {
  const data = [12, 5, 6, 7, 10, 9];
  const { container } = render(<BarChart initialData={data} />);
  expect(container.querySelector('svg')).toBeInTheDocument();
});
