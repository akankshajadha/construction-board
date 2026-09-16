const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8080;

// Enable CORS so your local HTML dashboard file can read data from this server
app.use(cors());
app.use(express.json());

// Simulation State - Baseline values that mimic changing construction site air rules
let currentData = {
    aqi: 75,
    pm25: 35,
    pm10: 70,
    temperature: 30.5,
    humidity: 60.0
};

// Background Routine Loop: Update and drift the data every 10 seconds automatically on the backend
setInterval(() => {
    // Generate minor realistic fluctuations (up or down slightly)
    currentData.pm25 += Math.floor(Math.random() * 5) - 2; // +/- 2 units
    currentData.pm10 += Math.floor(Math.random() * 7) - 3; // +/- 3 units
    currentData.temperature += (Math.random() - 0.5) * 0.4; // +/- 0.2°C
    currentData.humidity += (Math.random() - 0.5) * 1.5;   // +/- 0.75%

    // Boundary rules so data stays realistic
    currentData.pm25 = Math.max(5, Math.min(currentData.pm25, 150));
    currentData.pm10 = Math.max(10, Math.min(currentData.pm10, 250));
    currentData.temperature = Math.round(Math.max(15, Math.min(currentData.temperature, 45)) * 10) / 10;
    currentData.humidity = Math.round(Math.max(20, Math.min(currentData.humidity, 95)) * 10) / 10;

    // Calculate overall AQI based on particulate severity
    currentData.aqi = Math.max(Math.round(currentData.pm25 * 1.8), currentData.pm10);
    
    console.log(`[Backend Update Log] Data refreshed at ${new Date().toLocaleTimeString()}`);
}, 10000);

// API Endpoint: Expose the data stream packet to the network mapping URL
app.get('/api/v1/environment/live', (req, res) => {
    res.json(currentData);
});

// Start the Backend Node Server instance
app.listen(PORT, () => {
    console.log(`🚀 Backend server is running successfully on http://localhost:${PORT}`);
    console.log(`📡 Access live data packet feed directly at: http://localhost:${PORT}/api/v1/environment/live`);
});
