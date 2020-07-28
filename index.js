const express = require('express')
const hbs = require('express-handlebars')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const ConnectMongoDBSession = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const flash = require('connect-flash')
const keys = require('./keys')
const error404 = require('./middlewares/404error.js')
const userFastMiddleware = require('./middlewares/user')
const multerMiddleware = require('./middlewares/multer')
const helmet = require('helmet')
const compression = require('compression')

const userMiddleware = require('./middlewares/userMiddleware')

const app = express()

const validates = require('./middlewares/variable')
const conSession = new ConnectMongoDBSession({
    collection: 'sessions',
    uri: keys.URI
})

// Engine ----------------
app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: 'index', helpers: require('./helpers') }))
app.set('view engine', 'hbs')
app.set('views', 'pages')
// ------------------------

// Comp pages ---------------------------------------
const mainPage = require('./routes/mainPage')
const carsPage = require('./routes/carsPage')
const addCar = require('./routes/addCar')
const basketCars = require('./routes/basketCars')
const order = require('./routes/order')
const auth = require('./routes/auth')
const profile = require('./routes/profile')
// --------------------------------------------------

// Middlewares --------------------------
app.use(express.static(path.join(__dirname, 'public')))
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(express.urlencoded())

app.use(session({
    secret: keys.SESSION,
    resave: false,
    saveUninitialized: false,
    store: conSession
}))
app.use(multerMiddleware.single('avatar'))
app.use(userFastMiddleware)
app.use(helmet())
app.use(compression())
app.use(csrf())
app.use(flash())
app.use(validates)
app.use(userMiddleware)

// -----------------------------------

app.use('/', mainPage)
app.use('/cars', carsPage)
app.use('/add', addCar)
app.use('/basket', basketCars)
app.use('/order', order)
app.use('/auth', auth)
app.use('/profile', profile)
app.use(error404)

async function start() {
    await mongoose.connect(keys.URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })

    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => {
        console.log('running..')
    })
}
start()
