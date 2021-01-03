class DB {
    constructor() {
        this.storage = {}
    }

    async create(cityName, cityWeatherInfo) {
        this.storage[cityName] = cityWeatherInfo
        return Promise.resolve()
    }
    async upsert(cityName,cityWeatherInfo) {
        if(this.storage[cityName]) {
            if(this.storage[cityName].status !== cityWeatherInfo.status) {
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
        return Promise.resolve(this.storage)
    }

}

module.exports = { DB }
