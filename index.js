const express = require('express');
const cors = require('cors');
const debug = require('debug')('app:index');



const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

require('./db')();


require('./routes/routes')(app);

// app.route('/users')
//   .get(function(req, res, next) {
//     db.query(
//       "SELECT * FROM `Agents` WHERE id = ? LIMIT 3", req.params.userId,
//       function(error, results, fields) {
//         if (error) throw error;
//         res.json(results);
//       }
//     );
//   });


app.get('/', (req, res) => {
    res.send('welcome');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => debug(`Server listening on port ${PORT}`));