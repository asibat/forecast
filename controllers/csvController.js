const fs = require('mz/fs')
const parseCSV = require('csv-parse/lib/sync')

const { isEmpty, get } = require('lodash')
const { BAD_REQUEST } = require('http-status')

const { transformCondition} = require('../helpers')


async function process(ctx) {
    if (!validateCsvParams(ctx)) return

    const file = ctx.request.files.file
    try {
        const csvData = await getDataFromCSVFile(file.path)

        if (!validateCsvContent(ctx, csvData)) return
        const transformedData = transformCsvData(csvData)

        for (const cityData of Object.entries(transformedData)) {
            const cityName = cityData[0]
            const cityWeatherCondition = cityData[1]

            const currentCityTemperature = await ctx.openWeatherService.getCityCurrentTemperature(cityName)
            const shouldAlert = await ctx.openWeatherService.checkCityCondition(cityName, currentCityTemperature, cityWeatherCondition)

            const cityWeatherInfo = {
                currentTemperature: currentCityTemperature,
                condition: cityWeatherCondition,
                status: shouldAlert,
                lastTriggered: shouldAlert ? Date.now() : null
            }

            await ctx.db.create(cityName, cityWeatherInfo)
        }
    } catch (err) {
        ctx.body = err
        return
    }
    ctx.body = await ctx.db.getAllCities()
}



function transformCsvData(csvData) {
    let transformedData = {}

    if (isEmpty(csvData)) return
    csvData.slice(1).forEach(row => {
        transformedData[row[0]] = transformCondition(row[1])
    })

    return transformedData
}

function validateCsvContent(ctx, csvData) {
    const csvHeaders = csvData[0]
    const validHeader = csvHeaders[0].trim() === 'City' && csvHeaders[1].trim() === 'Condition'

    if (!(Array.isArray(csvHeaders) && validHeader)) {
        badRequest(ctx, 'Wrong or missing csv file headers row.')
        return false
    }
    return true
}

function validateCsvParams(ctx) {
    if (
        !ctx.request.headers['content-type'] ||
        !ctx.request.headers['content-type'].startsWith('multipart/form-data')
    ) {
        badRequest(ctx, 'content-type must be multipart/form-data')
        return false
    }

    if (isEmpty(get(ctx.request, 'files'))) {
        badRequest(ctx, 'Could not find attached files')
        return false
    }

    return true
}

async function getDataFromCSVFile(filePath) {
    let content = await fs.readFile(filePath, 'utf8')
    content = removeBOM(content)

    const parseOptions = {
        skip_empty_lines: true,
        skip_lines_with_empty_values: true
    }
    return parseCSV(content, parseOptions)
}

function removeBOM(str) {
    return str.replace(/\uFEFF/g, '')
}

function badRequest(ctx, errors = '') {
    ctx.status = BAD_REQUEST
    ctx.body = errors
}


module.exports = {
    process
}