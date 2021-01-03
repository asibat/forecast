const Router = require('koa-router')


const apiController = require('./controllers/apiController')
const csvController = require('./controllers/csvController')

const router = new Router({
    prefix: '/api'
})

router.get('/:cityName', apiController.show)
router.post('/update', apiController.update)
router.post('/upload', csvController.process)

module.exports = router.routes()
