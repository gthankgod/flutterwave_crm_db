module.exports = {
    success: function(res, data = [],  msg = 'Successful',status = true, statusCode = 200){

        return res.send({ status, msg, data, statusCode });            
    },
    error: function(err, res, msg = 'Could not fetch data', status = false, data = null, statusCode = 400){
        console.log(err)
        return res.send({ status, msg, data, statusCode });            
    }
}