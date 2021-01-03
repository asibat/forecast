module.exports = function () {
    return {...require('./config.json'), ...require('./custom-environment-variables.json')}
}()

