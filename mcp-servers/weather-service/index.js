const { MCPServer } = require('@modelcontextprotocol/server');
const express = require('express');
const fetch = require('node-fetch');

// Note: In a real implementation, you would use a real weather API
// This example uses mock data for demonstration purposes

// Create an MCP server
const server = new MCPServer({
  name: 'Weather Service MCP',
  description: 'MCP server for retrieving weather information',
  version: '1.0.0',
});

// Mock weather data
const weatherData = {
  'New York': {
    current: {
      temperature: 72,
      condition: 'Partly Cloudy',
      humidity: 65,
      windSpeed: 8,
      precipitation: 0,
    },
    forecast: [
      { date: '2023-06-01', high: 75, low: 60, condition: 'Sunny' },
      { date: '2023-06-02', high: 78, low: 62, condition: 'Partly Cloudy' },
      { date: '2023-06-03', high: 80, low: 65, condition: 'Cloudy' },
      { date: '2023-06-04', high: 82, low: 68, condition: 'Rain' },
      { date: '2023-06-05', high: 79, low: 64, condition: 'Partly Cloudy' },
    ],
    historical: {
      '2023-05-01': { high: 68, low: 52, condition: 'Sunny' },
      '2023-05-15': { high: 72, low: 58, condition: 'Rain' },
      '2023-05-30': { high: 70, low: 55, condition: 'Cloudy' },
    },
  },
  'London': {
    current: {
      temperature: 65,
      condition: 'Rainy',
      humidity: 80,
      windSpeed: 12,
      precipitation: 0.2,
    },
    forecast: [
      { date: '2023-06-01', high: 68, low: 55, condition: 'Cloudy' },
      { date: '2023-06-02', high: 70, low: 57, condition: 'Partly Cloudy' },
      { date: '2023-06-03', high: 72, low: 58, condition: 'Sunny' },
      { date: '2023-06-04', high: 75, low: 60, condition: 'Partly Cloudy' },
      { date: '2023-06-05', high: 73, low: 59, condition: 'Rain' },
    ],
    historical: {
      '2023-05-01': { high: 62, low: 48, condition: 'Cloudy' },
      '2023-05-15': { high: 65, low: 50, condition: 'Rain' },
      '2023-05-30': { high: 67, low: 52, condition: 'Partly Cloudy' },
    },
  },
  'Tokyo': {
    current: {
      temperature: 80,
      condition: 'Sunny',
      humidity: 70,
      windSpeed: 5,
      precipitation: 0,
    },
    forecast: [
      { date: '2023-06-01', high: 82, low: 68, condition: 'Sunny' },
      { date: '2023-06-02', high: 85, low: 70, condition: 'Sunny' },
      { date: '2023-06-03', high: 83, low: 69, condition: 'Partly Cloudy' },
      { date: '2023-06-04', high: 80, low: 67, condition: 'Rain' },
      { date: '2023-06-05', high: 78, low: 65, condition: 'Cloudy' },
    ],
    historical: {
      '2023-05-01': { high: 75, low: 60, condition: 'Sunny' },
      '2023-05-15': { high: 78, low: 63, condition: 'Partly Cloudy' },
      '2023-05-30': { high: 80, low: 65, condition: 'Rain' },
    },
  },
};

// Helper function to get weather data for a location
function getWeatherForLocation(location) {
  // Convert to title case for matching
  const formattedLocation = location
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  return weatherData[formattedLocation] || null;
}

// Register a tool to get current weather
server.registerTool({
  name: 'get_current_weather',
  description: 'Get the current weather for a location',
  parameters: {
    type: 'object',
    properties: {
      location: {
        type: 'string',
        description: 'The location to get weather for (e.g., "New York", "London", "Tokyo")',
      },
    },
    required: ['location'],
  },
  handler: async (params) => {
    const location = params.location;
    const weather = getWeatherForLocation(location);

    if (!weather) {
      return {
        success: false,
        error: `Weather data not available for ${location}`,
      };
    }

    return {
      success: true,
      location,
      weather: weather.current,
      timestamp: new Date().toISOString(),
    };
  },
});

// Register a tool to get weather forecast
server.registerTool({
  name: 'get_weather_forecast',
  description: 'Get the weather forecast for a location',
  parameters: {
    type: 'object',
    properties: {
      location: {
        type: 'string',
        description: 'The location to get weather forecast for (e.g., "New York", "London", "Tokyo")',
      },
      days: {
        type: 'number',
        description: 'Number of days to forecast (max 5)',
      },
    },
    required: ['location'],
  },
  handler: async (params) => {
    const location = params.location;
    const days = Math.min(params.days || 5, 5);
    const weather = getWeatherForLocation(location);

    if (!weather) {
      return {
        success: false,
        error: `Weather data not available for ${location}`,
      };
    }

    return {
      success: true,
      location,
      forecast: weather.forecast.slice(0, days),
      timestamp: new Date().toISOString(),
    };
  },
});

// Register a tool to get historical weather data
server.registerTool({
  name: 'get_historical_weather',
  description: 'Get historical weather data for a location',
  parameters: {
    type: 'object',
    properties: {
      location: {
        type: 'string',
        description: 'The location to get historical weather for (e.g., "New York", "London", "Tokyo")',
      },
      date: {
        type: 'string',
        description: 'The date to get historical weather for (YYYY-MM-DD)',
      },
    },
    required: ['location', 'date'],
  },
  handler: async (params) => {
    const location = params.location;
    const date = params.date;
    const weather = getWeatherForLocation(location);

    if (!weather) {
      return {
        success: false,
        error: `Weather data not available for ${location}`,
      };
    }

    if (!weather.historical[date]) {
      return {
        success: false,
        error: `Historical weather data not available for ${location} on ${date}`,
      };
    }

    return {
      success: true,
      location,
      date,
      weather: weather.historical[date],
    };
  },
});

// Start the server
const app = express();
const PORT = 3002;

server.applyMiddleware(app);

app.listen(PORT, () => {
  console.log(`Weather Service MCP server running at http://localhost:${PORT}`);
});