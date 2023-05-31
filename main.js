function getUserLocation() {
  let userLocation = document.getElementById("locationInput").value;
  document.getElementById("locationInput").value = "";
  return getForecast(userLocation);
}
async function getForecast(userLocation) {
  const response = await fetch(
    "https://api.weatherapi.com/v1/forecast.json?key=f9a34031850343348db153027233005&days=7&q=" +
    userLocation,
    { mode: "cors" }
    );
    const forecastData = await response.json();
    return parseForecast(forecastData);
  }
  function parseForecast(forecastData) {
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  console.log(forecastData);
  let weatherHolder = [];
  let currentWeather = {
    day: dayNames[new Date(forecastData.current.last_updated.slice(0, 10)).getDay()],
    time: forecastData.current.last_updated.slice(11, 16),
    location: forecastData.location.name,
    temp: forecastData.current.temp_c + "°C",
    feel: forecastData.current.feelslike_c + "°C",
    wind: forecastData.current.wind_kph + " km/h",
    condition: forecastData.current.condition.icon,
  }
  weatherHolder.push(currentWeather);
  function Weather(date, max, min, wind, condition) {
    this.date = date;
    this.max = max;
    this.min = min;
    this.wind = wind;
    this.condition = condition;
  }
  forecastData.forecast.forecastday.forEach((element) => {
    let day = dayNames[new Date(element.date).getDay()];
    let maxTemp = element.day.maxtemp_c + "°C";
    let minTemp = element.day.mintemp_c + "°C";
    let maxWind = element.day.maxwind_kph + " km/h";
    let condition = element.day.condition.text;
    weatherHolder.push(new Weather(day, maxTemp, minTemp, maxWind, condition));
  });
  console.log(weatherHolder);
  return displayWeather(weatherHolder);
}
function displayWeather(weatherHolder) {
  document.getElementById('location').textContent = weatherHolder.at(0).location;
  document.getElementById('day').textContent = weatherHolder.at(0).day;
  document.getElementById('time').textContent = weatherHolder.at(0).time;
  document.getElementById('condition').src = weatherHolder.at(0).condition;
  document.getElementById('currentTemp').textContent = weatherHolder.at(0).temp;
  document.getElementById('feelsLike').textContent = "Feels like " + weatherHolder.at(0).feel;
  document.getElementById('wind').textContent = "Wind " + weatherHolder.at(0).wind;
}
getForecast("melbourne, australia");