const Koa = require('koa')
const koaBody = require('koa-body')
const cors = require('@koa/cors')
const config = require('./config/config.json')
const router = require('./routes')

const { OpenWeatherService } = require('./services/OpenWeatherService')
const { DB } = require('./DB')

const app = new Koa()
const xrapidApiConfig = config.xrapidApi

const db = new DB()

// services
const openWeatherService = new OpenWeatherService({
    xrapidApiWeatherUrl: xrapidApiConfig.xrapidApiWeatherUrl,
    rapidApiKey: xrapidApiConfig["x-rapidapi-key"] || process.env["x-rapidapi-key"],
    rapidApiHost: xrapidApiConfig["x-rapidapi-host"] || process.env["x-rapidapi-host"],
    temperatureUnits: xrapidApiConfig.temperatureUnits,
    db
})

// A universal interceptor that prints the ctx each time a request is made on the server
if (process.env.NODE_ENV !== 'production') {
    app.use(async (ctx, next) => {
        console.log(ctx)
        await next()
    })
}

// Error handling
app.use(async function (ctx, next) {
    try {
        await next()
    } catch (err) {
        ctx.app.emit('error', err, ctx)
    }
})

app.context.openWeatherService = openWeatherService
app.context.db = db

app.use(koaBody({multipart: true}))
app.use(cors())
app.use(router)

// Start server
const port = 8000
module.exports = app.listen(port, function () {
    console.log('Server listening on', port)
})
