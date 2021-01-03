const rp = require('request-promise')
const config = require('../config/config.json')
const { transformCondition} = require('../helpers')

const xrapidApiConfig = config.xrapidApi

class OpenWeatherService {
    constructor(opts) {
        this.db = opts.db
        this.xrapidApiWeatherUrl = opts.xrapidApiWeatherUrl
        this.temperatureUnits = opts.temperatureUnits
        this.rapidApiKey = opts.rapidApiKey
        this.rapidApiHost = opts.rapidApiHost
        this.options = {
            url: this.xrapidApiWeatherUrl,
            qs: {
                units: this.temperatureUnits
            },
            headers: {
                'x-rapidapi-key': process.env.X_RAPID_API_KEY || xrapidApiConfig["x-rapidapi-key"],
                'x-rapidapi-host': process.env.X_RAPID_API_HOST ||  xrapidApiConfig["x-rapidapi-host"],
                useQueryString: true
            }
        }
    }

    async getCityCurrentTemperature(cityName) {
        this.options.method = 'GET'
        this.options.qs.q = cityName
        let response

        try {
            response = await rp(this.options)
            if (response) {
                response = JSON.parse(response).main.temp
            }
        } catch (e) {
            console.log(e)
            throw e
        }
        return response
    }
    async updateData(weatherData) {
        const citiesData = Object.entries(weatherData).map(cityData => {
            const temp = {}
            const {operator, temperature} = cityData[1].condition
            temp[cityData[0]] = `${operator}${temperature}`
            return temp
        })

        for(const cityData of citiesData) {
            let condition = transformCondition(Object.values(cityData)[0])
            const cityName = Object.keys(cityData)[0]

            const updatedTemp = await this.getCityCurrentTemperature(cityName)
            const shouldAlert = this.checkCityCondition(cityName, updatedTemp, condition)

            const cityWeatherInfo = {
                currentTemperature: updatedTemp,
                condition,
                status: shouldAlert,
                lastTriggered: shouldAlert ? Date.now() : null
            }
            await this.db.upsert(cityName, cityWeatherInfo)
        }


        return await this.db.getAllCities()
    }

    checkCityCondition(cityName, currentCityTemperature, condition) {
        switch (condition.operator) {
            case '<':
                return currentCityTemperature < condition.temperature
            case '>':
                return currentCityTemperature > condition.temperature
            case '=':
                return currentCityTemperature === condition.temperature
        }
    }
}

module.exports = { OpenWeatherService }