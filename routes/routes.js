module.exports = (app) => {
    app.use('/auth', require('./agents'));
}