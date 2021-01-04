const { isEmpty, get } = require('lodash')
const { BAD_REQUEST } = require('http-status')

async function process(ctx) {
    if (!validateCsvParams(ctx)) return

    const file = ctx.request.files.file
    try {
        const csvData = await ctx.csvService.getDataFromCSVFile(file.path)

        if (!validateCsvContent(ctx, csvData)) return
        const transformedData = ctx.csvService.transformCsvData(csvData)

        await ctx.csvService.bulkSave(transformedData)
    } catch (err) {
        ctx.body = err
        return
    }
    ctx.body = await ctx.db.getAllCities()
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

function badRequest(ctx, errors = '') {
    ctx.status = BAD_REQUEST
    ctx.body = errors
}


module.exports = {
    process
}
