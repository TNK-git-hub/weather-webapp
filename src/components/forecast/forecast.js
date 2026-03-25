import "./forecast.css";
import {
    Accordion,
    AccordionItemHeading,
    AccordionItem,
    AccordionItemPanel,
    AccordionItemButton
} from "react-accessible-accordion";

// 0-->6 = Sunday-->Saturday
const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];;

const Forecast = ({ data, unit }) => {
    const convertTemp = (temp) => {
        if (unit === "C") return Math.round(temp);
        return Math.round((temp * 9) / 5 + 32);
    };

    const dayInAWeek = new Date().getDay();
    // Get current day  in array
    const forcastDays = WEEK_DAYS.slice(dayInAWeek, WEEK_DAYS.length) // (0;7) (Mon --> Sar)
        .concat(WEEK_DAYS.slice(0, dayInAWeek)); // 0 

    // Short day names for compact display
    const shortDays = {
        "Monday": "Mon", "Tuesday": "Tue", "Wednesday": "Wed",
        "Thursday": "Thu", "Friday": "Fri", "Saturday": "Sat", "Sunday": "Sun"
    };

    // Get today's date in YYYY-MM-DD format to exclude it
    // eg: "2026-03-22T15:30:00.000Z" -> "2026-03-22"
    const todayStr = new Date().toISOString().split('T')[0];

    // Filter items to show only 12:00:00 forecasts and exclude today
    // eg: "2026-03-23 12:00:00" -> "2026-03-23"
    const dailyData = data.list.filter(item => {
        const itemDateStr = item.dt_txt.split(' ')[0];
        return item.dt_txt.includes("12:00:00") && itemDateStr !== todayStr;
    });

    return (
        <div className="forecast-card">
            <div className="forecast-header">
                <img className='icon' src="icons/g_cons/forecast.svg" alt="forecast" />
                <span>5-Day Forecast</span>
            </div>
            <Accordion allowZeroExpanded className="forecast-accordion">
                {dailyData.slice(0, 5).map((item, idx) => (
                    <AccordionItem key={idx}>
                        <AccordionItemHeading>
                            <AccordionItemButton>
                                <div className="forecast-row">
                                    <span className="forecast-day">
                                        {shortDays[forcastDays[idx]] || forcastDays[idx]}
                                    </span>
                                    <img
                                        alt="weather"
                                        className="forecast-icon"
                                        src={`icons/${item.weather[0].icon}.png`}
                                    />
                                    <span className="forecast-high">{convertTemp(item.main.temp_max)}°{unit}</span>
                                    <span className="forecast-low">{convertTemp(item.main.temp_min)}°{unit}</span>
                                </div>
                            </AccordionItemButton>
                        </AccordionItemHeading>
                        <AccordionItemPanel>
                            <div className="forecast-details-panel">
                                <div className="forecast-detail-item">
                                    <span className="fd-label">Feels like</span>
                                    <span className="fd-value">{convertTemp(item.main.feels_like)}°{unit}</span>
                                </div>
                                <div className="forecast-detail-item">
                                    <span className="fd-label">Wind</span>
                                    <span className="fd-value">{item.wind.speed} m/s</span>
                                </div>
                                <div className="forecast-detail-item">
                                    <span className="fd-label">Humidity</span>
                                    <span className="fd-value">{item.main.humidity}%</span>
                                </div>
                                <div className="forecast-detail-item">
                                    <span className="fd-label">Pressure</span>
                                    <span className="fd-value">{item.main.pressure} hPa</span>
                                </div>
                            </div>
                        </AccordionItemPanel>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}

export default Forecast;