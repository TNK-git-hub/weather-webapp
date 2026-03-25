import "./current-weather.css";

const CurrentWeather = ({ data, unit, setUnit }) => {

    const convertTemp = (temp) => {
        if (unit === "C") return Math.round(temp);
        return Math.round((temp * 9) / 5 + 32);
    };

    return (
        <div className="current-weather">
            <div className="current-weather-top">
                <div className="current-weather-left">
                    <span className="status-text">
                        CURRENTLY {data.weather[0].description.toUpperCase()}
                    </span>
                    <div className="weather-status">
                        <h1 className="city-name">{data.city.split(",")[0]}</h1>
                        <img
                            alt="weather"
                            className="status-icon"
                            src={`icons/${data.weather[0].icon}.png`}
                        />
                    </div>

                    {/* <p className="city-subtitle">{data.city}</p> */}
                </div>
                <div className="current-weather-right">
                    <div className="temp-container">
                        <p className="main-temp">{convertTemp(data.main.temp)}°<span className="temp-unit">{unit}</span></p>
                        <button
                            className="temperature-toggle"
                            onClick={() => setUnit(unit === "C" ? "F" : "C")}
                        >
                            °{unit === "C" ? "F" : "C"}
                        </button>
                    </div>
                    <div className="high-low">
                        <span className="high">High: {convertTemp(data.main.temp_max)}°{unit}</span>
                        <span className="low">Low: {convertTemp(data.main.temp_min)}°{unit}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CurrentWeather;