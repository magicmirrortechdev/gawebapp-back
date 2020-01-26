require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');

mongoose
    .connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((x) => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
    .catch((err) => console.error('Error connecting to mongo', err));
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);


const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

app.use(
    cors({
        credentials: true,
        origin: [process.env.FRONTENDPOINT]
    })
);

app.use(
    session({
        resave: false,
        saveUninitialized: true,
        secret: process.env.SECRET,
        cookie: { maxAge: 1000 * 60 * 60 }
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(bodyParser.json({ limit: '100mb', extended: true }));
app.use(cookieParser());
app.use(logger('dev'));

const index = require('./routes/index');
const auth = require('./routes/auth');
const client = require('./routes/client');
const post = require('./routes/post');
const expense = require('./routes/expense');
const job = require('./routes/job');
const estimate = require('./routes/estimate');

app.use('/', index);
app.use('/', auth);
app.use('/', client)
app.use('/', post)
app.use('/', expense)
app.use('/', estimate)
    // Uncomment this line for production
    //app.get('/*', (req, res) => res.sendFile(__dirname + '/public/index.html'));

module.exports = app;