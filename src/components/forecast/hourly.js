import "./hourly.css";

const HourlyForecast = ({ data, unit }) => {

    const convertTemp = (temp) => {
        if (unit === "C") return Math.round(temp);
        return Math.round((temp * 9) / 5 + 32);
    };

    const formatDate = (dt_txt) => {
        const date = new Date(dt_txt.replace(/-/g, '/'));
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        return `${day}/${month}`;
    };

    const formatTime = (dt_txt) => {
        const date = new Date(dt_txt.replace(/-/g, '/'));
        let hours = date.getHours();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        return `${hours} ${ampm}`;
    };

    const now = new Date();
    // Filter out past items. 
    const hourlyItems = data.list ? data.list.filter(item => {
        const itemDate = new Date(item.dt_txt.replace(/-/g, '/'));
        return itemDate > now;
    }) : [];

    const temps = hourlyItems.map(item => convertTemp(item.main.temp));
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);
    const range = maxTemp - minTemp || 1;

    const chartHeight = 40;
    const chartPadding = 10;
    const getY = (temp) => {
        return chartPadding + (chartHeight - 2 * chartPadding) * (1 - (temp - minTemp) / range);
    };

    return (
        <div className="hourly-forecast">
            <div className="hourly-header">
                <img className='icon' src="icons/g_cons/hourly.svg" alt="hourly" />
                <span>3-Hourly Forecast</span>
            </div>
            <div className="hourly-scroll">
                <div className="hourly-inner">
                    <svg className="hourly-chart-svg">
                        <polyline
                            points={hourlyItems.map((item, idx) => {
                                const temp = convertTemp(item.main.temp);
                                const x = idx * 80 + 40;
                                const y = getY(temp);
                                return `${x},${y}`;
                            }).join(' ')}
                            fill="none"
                            stroke="#ffb300"
                            strokeWidth="2"
                        />
                        {hourlyItems.map((item, idx) => {
                            const temp = convertTemp(item.main.temp);
                            const x = idx * 80 + 40;
                            const y = getY(temp);
                            return (
                                <circle
                                    key={idx}
                                    cx={x}
                                    cy={y}
                                    r="3"
                                    fill="#ffb300"
                                />
                            );
                        })}
                    </svg>
                    {hourlyItems.map((item, idx) => (
                        <div className="hourly-item" key={idx}>
                            <span className="hourly-date">{formatDate(item.dt_txt)}</span>
                            <span className="hourly-time">{formatTime(item.dt_txt)}</span>
                            <img
                                alt="weather"
                                className="hourly-icon"
                                src={`icons/${item.weather[0].icon}.png`}
                            />
                            <div className="chart-spacer" style={{ height: `${chartHeight}px`, width: '100%' }}></div>
                            <span className="hourly-temp">{convertTemp(item.main.temp)}°{unit}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HourlyForecast;
