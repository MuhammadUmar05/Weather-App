let currentTime = document.querySelector("#currentTime");
let currentTemp = document.querySelectorAll(".currentTemp");
let humidity = document.querySelector("#humidity");
let windSpeed = document.querySelector("#windSpeed");
let clouds = document.querySelector("#clouds");
let feelsLike = document.querySelector("#feelsLike");
let weatherIcon = document.querySelector("#weatherIcon");
let weatherInfo = document.querySelector("#weatherInfo");
let durations = document.querySelectorAll(".durations");
let forecastedIcons = document.querySelectorAll(".forecastedIcons");
let forecastedConditions = document.querySelectorAll(".weatherConditions");
let forecastedTemps = document.querySelectorAll(".forecastedTemps");
let maxTemp, minTemp, weatherCondition;
let backgroundImg = document.querySelector("#weatherDetails");
let form = document.querySelector("form");
let cityElement = localStorage.getItem("city") ?? "karachi";
saveData()

form.addEventListener("submit", (e) => {
    e.preventDefault();
    let inputField = document.querySelector("#cityInput");
    cityElement = inputField.value ?? "Karachi";
    saveData();
    displayData(); // Call displayData function to refresh the weather data based on city
});

// Function to convert temperature from Kelvin to Celsius
function kelvinToC(kelvin) {
    return Math.ceil(kelvin - 273.16);
}

// Fetching weather data from API using the city name
async function fetchWeather() {
    let URL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityElement}&APPID=${API_KEY}`;
    let response = await fetch(URL);
    let data = await response.json();
    return data;
}
// Function to get the current time of the required city using its coordinates
async function fetchTime() {
    let weatherData = await fetchWeather();
    let coordinates = weatherData["city"]["coord"];
    let latitude = coordinates["lat"];
    let longitude = coordinates["lon"];
    let URL = `https://timeapi.io/api/timezone/coordinate?latitude=${latitude}&longitude=${longitude}`;
    let response = await fetch(URL);
    let data = await response.json();
    return data;
}

async function displayData() {
    // Fetch weather data and time data
    const weatherData = await fetchWeather();
    const timeData = await fetchTime();

    // Display current temperature (in Celsius)
    currentTemp.forEach((temp) => {
        temp.innerText = `${kelvinToC(weatherData["list"][0]["main"]["temp"])}°C`;
    });

    // Display city and country name
    city.innerText = `${weatherData["city"]["name"]}, ${weatherData["city"]["country"]}`;

    // Display feels like temperature in Celsius
    feelsLike.innerText = `${kelvinToC(weatherData["list"][0]["main"]["feels_like"])}°C`;

    minTemp = `${kelvinToC(weatherData["list"][0]["main"]["temp_min"])}`;
    maxTemp = `${kelvinToC(weatherData["list"][0]["main"]["temp_max"])}`;
    weatherCondition = weatherData["list"][0]["weather"][0]["main"];

    weatherInfo.innerText = `${maxTemp}°C/${minTemp}°C ${weatherCondition}`;

    humidity.innerText = `${weatherData["list"][0]["main"]["humidity"]}%`;
    windSpeed.innerText = `${weatherData["list"][0]["wind"]["speed"]} m/s`;
    clouds.innerText = `${weatherData["list"][0]["clouds"]["all"]}%`;

    // To get the currentTime in the format of HH:MM
    let time = timeData["currentLocalTime"].toString().slice(11, 16);
    currentTime.innerText = time;

    // Toggle between morning and night background based on the time
    time = parseInt(time.slice(0, 2)); // To get the Hours of the currentTime only
    if (time >= 7 && time < 18) {
        backgroundImg.classList.remove("night-background");
        backgroundImg.classList.add("morning-background");
    } else {
        backgroundImg.classList.remove("morning-background");
        backgroundImg.classList.add("night-background");
    }

    // Display forecast data for the next 12 hours
    durations.forEach((duration, index) => {
        duration.innerText = weatherData["list"][index + 2]["dt_txt"].slice(10, 16);
    });

    // Display forecasted temperatures for the next 12 hours in Celsius
    forecastedTemps.forEach((temp, index) => {
        temp.innerText = `${kelvinToC(weatherData["list"][index + 2]["main"]["temp"])}°C`;
    });

    // Display forecasted weather conditions for the next 12 hours
    forecastedConditions.forEach((condition, index) => {
        condition.innerText = weatherData["list"][index + 2]["weather"][0]["main"];
    });

    // Display forecasted weather conditions for the next 12 hours
    forecastedIcons.forEach((icon, index) => {
        let forecastCondition = weatherData["list"][index + 2]["weather"][0]["main"];
        let forecastIcon = weatherData["list"][index + 2]["weather"][0]["icon"];
        checkIcon(forecastCondition, forecastIcon, icon);
    });

    // To update the main weather icon
    let nightDayIcon = weatherData["list"][0]["weather"][0]["icon"]; // To know whether the icon displayed should be day or night
    checkIcon(weatherCondition, nightDayIcon, weatherIcon)

}

// To update weather icons based on the weather condition
function checkIcon(condition, iconCode, weatherIcon) {
    if (condition == "Clear") {
        iconCode == "01n" ? weatherIcon.src = "asset/moon.png" : weatherIcon.src = "asset/sunny.png"
    } else if (condition == "Clouds") {
        iconCode == "02n" || iconCode == "03n" || iconCode == "04n" ? weatherIcon.src = "asset/cloudy_night.png" : weatherIcon.src = "asset/cloudy_sunny.png";
    } else if (condition == "Snow") {
        weatherIcon.src = "asset/snow.png"
    } else if (condition == "Rain" || condition == "Drizzle") {
        weatherIcon.src = "asset/rainy.png"
    } else if (condition == "Thunderstorm") {
        weatherIcon.src = "asset/thunderstorm.png"
    } else {
        weatherIcon.src = "asset/haze.png"
    }
}
// To save the searched city name in local storage
function saveData() {
    localStorage.setItem("city", cityElement);
}

// Call displayData to initialize and show the weather data when the page loads
displayData();
