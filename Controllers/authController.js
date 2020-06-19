const { dbCredentials } = require('../db');
const responseFormat = require('../utils/responseFormat');
const config = require('config');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: config.host,
    user: config.username,
    password: config.password,
    database: config.database
});

exports.register = (req, res) => {

    try {
        let { first_name, last_name, email, password, role_id } = req.body;

        db.query('SELECT * FROM Agents where email = ?', [email], async (err, results) => {

            if(err) return responseFormat.error(err, res);

            if(results.length > 0) return responseFormat.error(err, res, 'Agent already exist');

            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);

        

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
        const { email, password } = req.body;
        if(!email || !password) {
            err = 'Please put in an Email or Pasword';
            return responseFormat.error(err, res)
        }

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