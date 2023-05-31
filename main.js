function getUserLocation() {
  let location = document.getElementById("locationInput").value;
  document.getElementById("locationInput").value = "";
  weatherHolder = [];
  let forecast = document.getElementById("forecast");
  forecast.remove();
  return getForecast(location);
}

async function getForecast(location) {
  const response = await fetch(
    "https://api.weatherapi.com/v1/forecast.json?key=f9a34031850343348db153027233005&days=7&q=" +
      location,
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
  let weatherHolder = [];
  let currentWeather = {
    day: dayNames[
      new Date(forecastData.current.last_updated.slice(0, 10)).getDay()
    ],
    time: "Last updated: " + forecastData.current.last_updated.slice(11, 16),
    location: forecastData.location.name,
    temp: forecastData.current.temp_c + "°",
    feel: forecastData.current.feelslike_c + "°C",
    wind: forecastData.current.wind_kph + " km/h",
    condition: forecastData.current.condition.icon,
  };
  weatherHolder.push(currentWeather);
  function Weather(date, max, min, wind, rain, conditionDay, conditionNight) {
    this.date = date;
    this.max = max;
    this.min = min;
    this.wind = wind;
    this.rain = rain;
    this.conditionDay = conditionDay;
    this.conditionNight = conditionNight;
  }
  forecastData.forecast.forecastday.forEach((element) => {
    let day = dayNames[new Date(element.date).getDay()];
    let maxTemp = element.day.maxtemp_c + "°";
    let minTemp = element.day.mintemp_c + "°";
    let maxWind = element.day.maxwind_kph + " km/h";
    let rain = element.day.daily_chance_of_rain + "%";
    let conditionDay = element.hour.at(12).condition.icon;
    let conditionNight = element.hour.at(0).condition.icon;
    weatherHolder.push(
      new Weather(
        day,
        maxTemp,
        minTemp,
        maxWind,
        rain,
        conditionDay,
        conditionNight
      )
    );
  });
  return displayWeather(weatherHolder);
}

function displayWeather(weatherHolder) {
  let main = document.createElement("div");
  main.id = "forecast";
  document.getElementById("main").appendChild(main);
  document.getElementById("location").textContent =
    weatherHolder.at(0).location;
  document.getElementById("day").textContent = weatherHolder.at(0).day;
  document.getElementById("time").textContent = weatherHolder.at(0).time;
  document.getElementById("condition").src = weatherHolder.at(0).condition;
  document.getElementById("currentTemp").textContent = weatherHolder.at(0).temp;
  document.getElementById("feelsLike").textContent =
    "Feels like " + weatherHolder.at(0).feel;
  document.getElementById("wind").textContent =
    "Wind " + weatherHolder.at(0).wind;

  weatherHolder.forEach((element) => {
    if ("location" in element !== true) {
      if (element.date === weatherHolder.at(0).day) {
      element.date = "Today";
    }
    let forecastDiv = document.createElement("div");
    forecastDiv.classList.add("box", "forecast");
    main.appendChild(forecastDiv);

    let forecastDay = document.createElement("p");
    forecastDay.classList.add("forecastDay");
    forecastDay.textContent = element.date;
    forecastDiv.appendChild(forecastDay);

    let forecastTemp = document.createElement("p");
    forecastTemp.classList.add("forecastTemp");
    forecastTemp.textContent = element.min + " / " + element.max;
    forecastDiv.appendChild(forecastTemp);

    let forecastConditionDay = document.createElement("img");
    forecastConditionDay.classList.add("forecastConditionDay");
    forecastConditionDay.src = element.conditionDay;
    forecastDiv.appendChild(forecastConditionDay);
    
    let forecastConditionNight = document.createElement("img");
    forecastConditionNight.classList.add("forecastConditionNight");
    forecastConditionNight.src = element.conditionNight;
    forecastDiv.appendChild(forecastConditionNight);
    
    let forecastRainImg = document.createElement("img");
    forecastRainImg.classList.add("forecastRainImg");
    forecastRainImg.src = "water.svg";
    forecastDiv.appendChild(forecastRainImg);

    let forecastRain = document.createElement("p");
    forecastRain.classList.add("forecastRain");
    forecastRain.textContent = element.rain;
    forecastDiv.appendChild(forecastRain);

    let forecastWindImg = document.createElement("img");
    forecastWindImg.classList.add("forecastWindImg");
    forecastWindImg.src = "weather-windy.svg";
    forecastDiv.appendChild(forecastWindImg);

    let forecastWind = document.createElement("p");
    forecastWind.classList.add("forecastWind");
    forecastWind.textContent = element.wind;
    forecastDiv.appendChild(forecastWind);
    }
  });
}
getForecast("melbourne, australia");
