//GeoDB API is used to get lat and lon of the city that user wants to search for 
export const geoApiOptions = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': '4d344c8219msh4b61bf28726167cp119881jsna3fd3cb53170',
		'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com'
	}
};

export const GEO_API_URL = 'https://wft-geo-db.p.rapidapi.com/v1/geo';

//Openwaethermap API
export const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';
export const WEATHER_API_KEY = 'a8970444393af38e30756a7d13fb8883';

