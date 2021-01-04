const {sortBy} = require('lodash')

class DB {
    constructor() {
        this.storage = {}
    }

    async create(cityName, cityWeatherInfo) {
        this.storage[cityName] = cityWeatherInfo
        return Promise.resolve()
    }

    async upsert(cityName, cityWeatherInfo) {
        if (this.storage[cityName]) {
            if (this.storage[cityName].status !== cityWeatherInfo.status) {
                this.storage[cityName] = cityWeatherInfo
            } else {
                this.storage[cityName].currentTemperature = cityWeatherInfo.currentTemperature
            }
        } else {
            this.storage[cityName] = cityWeatherInfo
        }
        return Promise.resolve()
    }

    async getAllCities() {
        let citiesData = Object.keys(this.storage).map(key => {

            return {cityName: key, ...this.storage[key]}
        })
        citiesData = sortBy(citiesData, [city => (!city.status), city => city.cityName])
        return Promise.resolve(citiesData)
    }

    async getCurrentCityAlertStatusByCityName(cityName) {
        return Promise.resolve(this.storage[cityName].status)
    }

}

module.exports = { DB }
