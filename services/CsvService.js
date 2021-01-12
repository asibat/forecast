const fs = require('mz/fs')
const parseCSV = require('csv-parse/lib/sync')
const { isEmpty } = require('lodash')

const { transformCondition} = require('../helpers')
const { csvHeaderInterface, csvParseOptions } = require('../constants')

class CsvService {
    constructor(opts) {
        this.db = opts.db
        this.openWeatherService = opts.openWeatherService
    }
    async bulkSave(transformedCsvData) {
        for (const cityData of Object.entries(transformedCsvData)) {
            const cityName = cityData[0]
            const cityWeatherCondition = cityData[1]

            const currentCityTemperature = await this.openWeatherService.getCityCurrentTemperature(cityName)
            const shouldAlert = await this.openWeatherService.checkCityCondition(cityName, currentCityTemperature, cityWeatherCondition)

            const cityWeatherInfo = {
                currentTemperature: currentCityTemperature,
                condition: cityWeatherCondition,
                status: shouldAlert,
                lastTriggered: shouldAlert ? Date.now() : null
            }

            await this.db.create(cityName, cityWeatherInfo)
        }
    }
    transformConditionToObject(csvData) {
        let transformedData = {}
        const { City, Condition} = csvHeaderInterface

        if (isEmpty(csvData)) return

        csvData.forEach(row => {
            transformedData[row[City]] = transformCondition(row[Condition])
        })

        return transformedData
    }

    async getDataFromCSVFile(filePath) {
        let content = await fs.readFile(filePath, 'utf8')
        content = this.removeBOM(content)

        return parseCSV(content, csvParseOptions)
    }

    removeBOM(str) {
        return str.replace(/\uFEFF/g, '')
    }

}


module.exports = { CsvService}