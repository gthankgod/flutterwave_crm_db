module.exports = (app) => {
    app.use('/agents', require('./agents'));
}