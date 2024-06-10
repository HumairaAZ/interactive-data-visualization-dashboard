# Interactive Data Visualization Dashboard

[Live Demo](https://humairaaz.github.io/interactive-data-visualization-dashboard/)

## Overview

This project is an interactive data visualization dashboard showcasing real-time weather data for top cities globally. Built with React, D3.js, and Tailwind CSS, it features advanced interactivity, responsive design, and a polished user experience. The dashboard includes dynamic data sorting, filtering, zooming, and tooltips, making it a powerful tool for data analysis and presentation.

## Features

- **Real-Time Weather Data**: Fetches real-time weather data using the OpenWeatherMap API.
- **Interactive Charts**: Smooth transitions, dynamic data sorting, and filtering.
- **Responsive Design**: Fully responsive layout optimized for both large and small screens.
- **Tooltips**: Detailed tooltips display additional information on hover.
- **Zoom and Pan**: Users can zoom and pan the chart for better data exploration.

## Technologies Used

- **React**: Front-end library for building user interfaces.
- **D3.js**: JavaScript library for producing dynamic, interactive data visualizations.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **OpenWeatherMap API**: Provides real-time weather data.

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.
- An OpenWeatherMap API key.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/HumairaAZ/interactive-data-visualization-dashboard.git
   ```
2. Navigate to the project directory:
   ```bash
   cd interactive-data-visualization-dashboard
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

### Configuration

1. Create a `.env` file in the root directory.
2. Add your OpenWeatherMap API key to the `.env` file:
   ```env
   REACT_APP_OPENWEATHERMAP_API_KEY=your_api_key_here
   ```

### Running the Application

Start the development server:
```bash
npm start
```

The application will open in your default browser at `http://localhost:3000`.

### Building for Production

To create a production build, run:
```bash
npm run build
```

## Deployment

This project is deployed using GitHub Pages. To deploy your own version, follow these steps:

1. Commit and push your changes to the `main` branch.
2. Deploy to GitHub Pages:
   ```bash
   npm run deploy
   ```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

