async function getSensorData() {

    try {

        const response = await fetch("data/sensor.json");

        if (!response.ok) {
            throw new Error("Unable to fetch sensor data");
        }

        const data = await response.json();

        document.getElementById("temperature").textContent =
            data.temperature;

        document.getElementById("humidity").textContent =
            data.humidity;

        document.getElementById("pm25").textContent =
            data.pm25;

        document.getElementById("pm10").textContent =
            data.pm10;

        updateAirQuality(data.pm25, data.pm10);

        document.getElementById("lastUpdated").textContent =
            new Date().toLocaleTimeString();

    }

    catch (error) {

        console.error(error);

        document.getElementById("airStatus").textContent =
            "DATA ERROR";
    }
}


function updateAirQuality(pm25, pm10) {

    const status = document.getElementById("airStatus");

    if (pm25 <= 30 && pm10 <= 50) {

        status.textContent = "GOOD";

    } else if (pm25 <= 60 && pm10 <= 100) {

        status.textContent = "MODERATE";

    } else {

        status.textContent = "POOR";
    }
}


// First reading
getSensorData();


// Automatically update every 10 seconds
setInterval(getSensorData, 10000);