const fs = require('mz/fs')
const parseCSV = require('csv-parse/lib/sync')
const { isEmpty } = require('lodash')

const { transformCondition} = require('../helpers')

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
    transformCsvData(csvData) {
        let transformedData = {}

        if (isEmpty(csvData)) return
        csvData.slice(1).forEach(row => {
            transformedData[row[0]] = transformCondition(row[1])
        })

        return transformedData
    }
    async getDataFromCSVFile(filePath) {
        let content = await fs.readFile(filePath, 'utf8')
        content = this.removeBOM(content)

        const parseOptions = {
            skip_empty_lines: true,
            skip_lines_with_empty_values: true
        }
        return parseCSV(content, parseOptions)
    }

    removeBOM(str) {
        return str.replace(/\uFEFF/g, '')
    }

}


module.exports = { CsvService}