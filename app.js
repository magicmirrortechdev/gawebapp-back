require('dotenv').config()

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const express = require('express')
const mongoose = require('mongoose')
const logger = require('morgan')
const path = require('path')
const cors = require('cors')
const session = require('cookie-session')
const passport = require('./config/passport')
const worker = require('./worker/queueArgyle')
const compression = require('compression')

//local
//worker.start('k6lRPA.z2LVhA:YzbUwSWg9GeiAU29', 'LOCAL:payments', 'LOCAL', 'us-east-1-a-queue.ably.io:5671/shared');

//staging
//worker.start('k6lRPA.cucUtg:XLmTdAyYrblIBpKP', 'GA:payments', 'GA', 'us-east-1-a-queue.ably.io:5671/shared');

//production
//worker.start('W7Josg.fLykxw:lZzlEJw-VacfxEX3', 'GA:payments', 'GA', 'us-east-1-a-queue.ably.io:5671/shared')
const optionsMongoose = {
  keepAlive: true,
  keepAliveInitialDelay: 300000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  poolSize: 20, // Maintain up to 5 socket connections
  socketTimeoutMS: 300000, // Close sockets after 45 seconds of inactivity
}

mongoose
  .connect(process.env.DBV2, optionsMongoose)
  .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))

const app_name = require('./package.json').name
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`)

const app = express()
app.use(
  cors({
    credentials: true,
    exposedHeaders: 'Version',
    origin: [process.env.FRONTENDPOINT, process.env.REDIRECT_ENDPOINT],
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

const version = 'V 2.7.1'
app.use(function (req, res, next) {
  res.header('Version', version)
  next()
})

const indexV2 = require('./v2/routes/indexRoute')
const userV2 = require('./v2/routes/UserRoute')
const expenseV2 = require('./v2/routes/ExpenseRoute')
const clientV2 = require('./v2/routes/ClientRoute')
const jobV2 = require('./v2/routes/JobsRoute')
const invoiceV2 = require('./v2/routes/InvoiceRoute')
const timeV2 = require('./v2/routes/TimeRoute')
const migration = require('./v2/routes/MigrationRoute')

app.use('/v2', indexV2)
app.use('/v2/migration', migration)
app.use('/v2/user', userV2)
app.use('/v2/time', timeV2)
app.use('/v2/expense', expenseV2)
app.use('/v2/client', clientV2)
app.use('/v2/job', jobV2)
app.use('/v2/invoice', invoiceV2)
require('./v2/routes/ForgotPasswordRoute')(app)
require('./v2/routes/ResetPasswordRoute')(app)
require('./v2/routes/UpdatePasswordViaEmailRoute')(app)

module.exports = app
