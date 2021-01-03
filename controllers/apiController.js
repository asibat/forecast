const { OK } = require('http-status')

async function show(ctx) {
    let cityCurrentTemperature

    try {
        cityCurrentTemperature = await ctx.openWeatherService.getCityCurrentTemperature(ctx.request.params.cityName)
    } catch (e) {
        ctx.body = e.message
        return
    }

    if (cityCurrentTemperature) {
        ctx.body = cityCurrentTemperature
        ctx.status = OK
    }
}

async function update(ctx) {
    const body = ctx.request.body

    ctx.body = await ctx.openWeatherService.updateData(body)
}
module.exports = {
    show,
    update
}