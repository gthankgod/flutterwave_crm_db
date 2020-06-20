const { dbCredentials } = require('../db');
const responseFormat = require('../utils/responseFormat');
const config = require('config');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Joi = require('joi');

const db = mysql.createConnection({
    host: config.host,
    user: config.username,
    password: config.password,
    database: config.database
});

exports.register = (req, res) => {

    try {
        let { first_name, last_name, email, password, role_name } = req.body;

        db.query('SELECT * FROM Agents where email = ?', [email], async (err, results) => {

            if(err) return responseFormat.error(err, res);

            if(results.length > 0) return responseFormat.error(err, res, 'Agent already exist');

            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);
            let role_id;

            db.query('SELECT id from agent_roles where role_name = ?',[role_name], async (err, res) => {
                if(err) return responseFormat.error(err, res, 'Please put put in a valid role');
                
                if(res.length < 1) {
                    return responseFormat.error('Please put put in a valid role', res, 'Please put put in a valid role');
                }
                
                role_id = res[0].role_id
            
            });
        

            db.query('INSERT INTO Agents SET ?', { first_name,last_name,role_id, email, password }, (err, data) => {
                if(err) return responseFormat.error(err, res, 'Error exist');

                // const payload = {
                //     userId: {
                //         id: user.id
                //     }
                // }

                return responseFormat.success(res, data, 'Successfully added user');            
            })

        });
    } catch (error) {
        responseFormat.error(err, res, err.messgge, false, 500)
    }

    
}

exports.login = async (req, res) => {
    try {

        const { error } = validateLoginRequest(req.body);

        if(error) return responseFormat.error(error, res, 'Email / Password Format is not Valid');

        const { email, password } = req.body;
      

        db.query('SELECT * FROM Agents where email = ?', [email], async (err, results) => {
            if(err) return responseFormat.error(err, res);

            if(results.length < 1 || !(await bcrypt.compare(password, results[0].password))){
                return responseFormat.error('Email or Password is Incorrect', res);
            }

            console.log(results[0].id);
            const payload = results[0].id.toString();

            const token = jwt.sign({ payload}, config.get('jwtSecret'), { expiresIn: config.get('jwtExpire')})

            
            responseFormat.success(res, { token, user_info: results[0] });
        })

    } catch (err) {
        return responseFormat.error(err, res, 500);
    }
};

function validateLoginRequest(request) {
    const schema = {
        email: Joi.string(),
        password: Joi.string().required()
    }

    return Joi.validate(request, schema);
}

function validateLoginRequest(request) {
    const schema = {
        email: Joi.string().required(),
        password: Joi.string(),
        role_name: Joi.string(),
        first_name: Joi.string().required(),
        last_name: Joi.string().required()

    }

    return Joi.validate(request, schema);
}
