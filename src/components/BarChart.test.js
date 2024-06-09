import React from 'react';
import { render, waitFor } from '@testing-library/react';
import BarChart from './BarChart';
import '@testing-library/jest-dom/extend-expect';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([12, 5, 6, 7, 10, 9]),
  })
);

jest.mock('socket.io-client', () => {
  return {
    io: () => ({
      on: jest.fn(),
      disconnect: jest.fn(),
    }),
  };
});

test('renders bar chart', async () => {
  const { container } = render(<BarChart />);
  await waitFor(() => expect(container.querySelector('svg')).toBeInTheDocument());
});
