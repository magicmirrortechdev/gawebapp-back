require('dotenv').config()

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const express = require('express')
const mongoose = require('mongoose')
const logger = require('morgan')
const path = require('path')
const cors = require('cors')
const session = require('express-session')
const passport = require('./config/passport')
const compression = require('compression')

const worker = require('./worker/queueArgyle')

//local
//worker.start('k6lRPA.z2LVhA:YzbUwSWg9GeiAU29', 'LOCAL:payments', 'LOCAL', 'us-east-1-a-queue.ably.io:5671/shared');

//staging
//worker.start('k6lRPA.cucUtg:XLmTdAyYrblIBpKP', 'GA:payments', 'GA', 'us-east-1-a-queue.ably.io:5671/shared');

//production
worker.start('W7Josg.fLykxw:lZzlEJw-VacfxEX3', 'GA:payments', 'GA', 'us-east-1-a-queue.ably.io:5671/shared')

mongoose
  .connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch(err => console.error('Error connecting to mongo', err))
mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)

const app_name = require('./package.json').name
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`)

const app = express()

app.use(
  cors({
    credentials: true,
    origin: [process.env.FRONTENDPOINT],
  })
)

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SECRET,
    cookie: { maxAge: 1000 * 60 * 60 },
  })
)

app.use(passport.initialize())
app.use(passport.session())
app.use(compression())

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')
app.use(express.static(path.join(__dirname, 'public')))

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ limit: '1000mb', extended: true }))
app.use(bodyParser.json({ limit: '1000mb', extended: true }))
app.use(cookieParser())
app.use(logger('dev'))

const index = require('./routes/index')
const auth = require('./routes/auth')
const client = require('./routes/client')
const post = require('./routes/post')
const expense = require('./routes/expense')
const job = require('./routes/job')
const estimate = require('./routes/estimate')
const invoice = require('./routes/invoice')

app.use('/', index)
app.use('/', auth)
app.use('/', client)
app.use('/', post)
app.use('/', expense)
app.use('/', estimate)
app.use('/', invoice)
require('./routes/forgotPassword')(app)
require('./routes/resetPassword')(app)
require('./routes/updatePasswordViaEmail')(app)

module.exports = app
