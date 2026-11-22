import './App.css';
import Search from './components/search/search';
import CurrentWeather from './components/current-weather/current-weather';
import Forecast from './components/forecast/forecast'
import HourlyForecast from './components/forecast/hourly';
import ThemeToggle from './components/theme-toggle/theme-toggle';
import { useTheme } from './utils/theme';
import { WEATHER_API_URL, WEATHER_API_KEY } from './api';
import { useState } from 'react';


function App() {

  const { theme, toggleTheme } = useTheme();
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [unit, setUnit] = useState("C");

  const convertTemp = (temp) => {
    if (unit === "C") return Math.round(temp);
    return Math.round((temp * 9) / 5 + 32);
  };

  const handleSearchChange = (searchData) => {
    // Spliting value: because lat and lon are in 1 string: eg. "21.0278 105.8342"
    const [lat, lon] = searchData.value.split(" ");
    // openweathermap API Call URL for current weather: https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
    const currentWeatherFetch = fetch(`${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`);
    // openweathermap API Call URL for forecast weather: https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
    const forecastFetch = fetch(`${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`);

    // send both request at the same time and wait until both of them are finished
    Promise.all([currentWeatherFetch, forecastFetch])
      .then(async (response) => {
        const weatherResponse = await response[0].json();
        const forecastResponse = await response[1].json();

        setCurrentWeather({ city: searchData.label, ...weatherResponse });
        setForecast({ city: searchData.label, ...forecastResponse });
      })

      .catch((err) => console.log(err));
  }

  console.log(currentWeather);
  console.log(forecast);

  // Helper function to get wind direction from degrees
  const getWindDirection = (deg) => {
    const directions = ['North', 'North East', 'East', 'South East', 'South', 'South West', 'West', 'North West'];
    const idx = Math.round(deg / 45) % 8;
    return directions[idx];
  };

  // ===== LANDING PAGE  =====
  if (!currentWeather) {
    return (
      <div className="landing-page">
        <nav className="navbar">
          <div className="navbar-logo">
            <img src="icons/g_cons/logo.svg" alt="logo" />
            <p className="logo-text">AtmosLens</p>
          </div>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </nav>
        <div className="landing-content">
          <div className="landing-search-wrapper">
            <Search onSearchChange={handleSearchChange} />
          </div>
          <div className="landing-brand">
            <h1>AtmosLens</h1>
            <p>Precision weather viewed through a pristine optical lens.</p>
          </div>
        </div>
      </div>
    );
  }

  // ===== RESULTS PAGE (with weather data) =====
  return (
    <div className="results-page">
      <nav className="results-navbar">
        <div className="results-navbar-left">
          <Search onSearchChange={handleSearchChange} />
        </div>
        <div className="navbar-logo">
          <img src="icons/g_cons/logo.svg" alt="logo" />
          <p className="logo-text">AtmosLens</p>
        </div>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </nav>

      <div className="results-content">
        {currentWeather && <CurrentWeather data={currentWeather} unit={unit} setUnit={setUnit} />}

        {forecast && <HourlyForecast data={forecast} unit={unit} />}

        <div className="weather-bottom-section">
          <div className="detail-cards-grid">
            {/* Feels Like */}
            <div className="detail-card">
              <div className="detail-card-header">
                <img className='icon' src="icons/g_cons/feels-like.svg" alt="feels like" />
                Feels Like
              </div>
              <div className="detail-card-value">{convertTemp(currentWeather.main.feels_like)}°{unit}</div>
              <div className="detail-card-desc">
                {Math.round(currentWeather.main.feels_like) < Math.round(currentWeather.main.temp) ? "Wind chill is significant" : "Humidity is making it feel warmer"}
              </div>
            </div>
            {/* Wind Speed */}
            <div className="detail-card">
              <div className="detail-card-header">
                <img className='icon' src="icons/g_cons/wind.svg" alt="wind speed" />
                Wind Speed
              </div>
              <div className="detail-card-value">{Math.round(currentWeather.wind.speed * 3.6)} km/h</div>
              <div className="detail-card-desc">Coming from {getWindDirection(currentWeather.wind.deg)}</div>
            </div>
            {/* Humidity */}
            <div className="detail-card">
              <div className="detail-card-header">
                <img className='icon' src="icons/g_cons/humidity.svg" alt="humidity" />
                Humidity
              </div>
              <div className="detail-card-value">{currentWeather.main.humidity}%</div>
              <div className="detail-card-desc">
                {currentWeather.main.humidity > 70 ? `The dew point is ${convertTemp(currentWeather.main.temp - ((100 - currentWeather.main.humidity) / 5))}°${unit}` : "Comfortable humidity level"}
              </div>
            </div>
            {/* Pressure */}
            <div className="detail-card">
              <div className="detail-card-header">
                <img className='icon' src="icons/g_cons/pressure1.svg" alt="pressure" />
                Pressure
              </div>
              <div className="detail-card-value">{currentWeather.main.pressure} hPa</div>
              <div className="detail-card-desc">
                {currentWeather.main.pressure > 1013 ? "Stable air pressure" : "Low pressure system"}
              </div>
            </div>

          </div>

          {/* 5-Day Forecast */}
          {forecast && <Forecast data={forecast} unit={unit} />}
        </div>
      </div>
    </div>
  );
}


export default App;
