import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const WeatherInfoBox = ({ label, value }) => {
  return (
    <div className="weather-info-box">
      <p className="weather-label">{label}<p className="weather-value">{value}</p></p>
      
    </div>
  );
};

const App = () => {
  const [weatherData, setWeatherData] = useState({
    temperature: null,
    humidity: null,
    windSpeed: null,
    location: "Iligan City",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("Iligan City"); // New state for search term

  const fetchWeatherByLocation = async (location) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${location}+Iligan&limit=1`
      );
      const loc = response.data[0];
      fetchWeather(loc.lon, loc.lat);
    } catch (error) {
      console.error("Error fetching weather by location:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeather = async (lon, lat) => {
    try {
      const apiKey = "5547dd5aab46608722fe1d8b508d64a4";
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );
      const { main, wind } = response.data;
      setWeatherData({
        temperature: main.temp,
        humidity: main.humidity,
        windSpeed: wind.speed,
        location: searchTerm,
      });
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError("Unable to fetch weather data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather("124.2452", "8.2280");
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  if (loading) {
    return (
      
        <div className="loading">Loading...</div>
      
    );
  }

  if (error) {
    return (
   
        <div className="error">Error: {error}</div>
      
    );
  }

  return (
    
    <div className="Container">
      <img src="logo.png" alt="logo"></img>
      <h1>Weather Forecast</h1>
      <input
        type="text"
        placeholder="Enter Location"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <button onClick={() => fetchWeatherByLocation(searchTerm)}>Search</button>
      <h2>{weatherData.location}</h2>
      
      <div className="weather-info-container">
        <WeatherInfoBox label="Temperature" value={`${weatherData.temperature}°C`}/>
        <WeatherInfoBox label="Humidity" value={`${weatherData.humidity}%`} />
        <WeatherInfoBox label="Wind Speed" value={`${weatherData.windSpeed} m/s`}/>
        <WeatherInfoBox label="Location" value={weatherData.location} />
      </div>
    </div>
  );
};

export default App;