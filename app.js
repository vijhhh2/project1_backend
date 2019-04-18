const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');


const app = express();

const db = require('./config/keys').mongoUri;

mongoose.connect(db, {useNewUrlParser: true})
.then(() => console.log('Mongodb connected'))
.catch(err => console.log(err))

const port = process.env.PORT || 5000;

app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: false}));

app.use('/', require('./routes/index'));

app.use('/users', require('./routes/users'));

app.listen(port, console.log(`Server started on port ${port}`));