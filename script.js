class Weather {
	constructor(apiKey, defaultUnits = 'imperial') {
		this.apiKey = apiKey;
		this.defaultUnits = defaultUnits;
	}

	async getWeather(options) {
		const units = options.units || this.defaultUnits;

		if (options.zip) {
			return await this.getWeatherByZip(options.zip, units);
		} else if (options.city) {
			return await this.getWeatherByCity(options.city, units);
		} else if (options.coords) {
			return await this.getWeatherByCoords(options.coords, units);
		} else {
			throw new Error('No valid method for fetching weather data provided.');
		}
	}

	// Fetch weather by zip code
	async getWeatherByZip(zip, units = this.defaultUnits) {
		const path = `https://api.openweathermap.org/data/2.5/weather?zip=${zip}&units=${units}&appid=${this.apiKey}`;
		return await this.fetchData(path, units);
	}

	// Fetch weather by city name
	async getWeatherByCity(city, units = this.defaultUnits) {
		const path = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${this.apiKey}`;
		return await this.fetchData(path, units);
	}

	// Fetch weather using coordinates
	async getWeatherByCoords(coords, units = this.defaultUnits) {
		const { lat, lon } = coords;
		const path = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${this.apiKey}`;
		return await this.fetchData(path, units);
	}

	// Fetch data from API
	async fetchData(path, units) {
		try {
			const response = await fetch(path);
			const json = await response.json();

			if (json.main && json.weather) {
				return {
					temp: json.main.temp,
					description: json.weather[0].description,
					units: units === 'imperial' ? '°F' : '°C',
				};
			} else {
				throw new Error('Unexpected Error: Could not retrieve weather data.');
			}
		} catch (err) {
			console.log(err.message);
			return null;
		}
	}
}

export default Weather;
