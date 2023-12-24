if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');  //
const app = express();     //
const path = require('path');   //
const mongoose = require('mongoose');    //  
const ejsMate = require('ejs-mate');     //
const session = require('express-session'); //
const flash = require('connect-flash'); //
const ExpressError = require('./utils/ExpressError');  //
const methodOverride = require('method-override');    //
const passport = require('passport'); //
const LocalStrategy = require('passport-local'); //
const User = require('./models/user'); //
const mongoSanitize = require('express-mongo-sanitize'); //
const helmet = require('helmet'); //
const MongoStore = require('connect-mongo'); //

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

// const dbUrl = process.env.DB_URL; // 

const dbUrl = process.env.DB_URL || 'mongodb://0.0.0.0:27017/yelp-camp';

+-mongoose.connect(dbUrl)
    .then(() => {
        console.log("Database Connected");
    })
    .catch(err => {
        console.log("MONGO CONNECTION ERROR!!!");
        console.log(err);
    })


// 
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//
app.use(express.urlencoded({ extended: true })) // for using request body of post
app.use(methodOverride('_method')); //
app.use(express.static(path.join(__dirname, 'public'))); //
app.use(mongoSanitize({
    replaceWith: '_'
})); //


const secret = process.env.SECRET || 'keepBetterSecret';
//
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60, // seconds
    crypto: {
        secret,
    }
});

store.on("error", function(e){
    console.log("Session storeerror", e);
})

//
const sessionConfig = {
    store,
    name: 'session', // connect.SID is default name, this option is to keep custom name for our sesion
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // sexure: true, // use only in production, (for HTTPS). localhost is not HTTPS
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // mSec
        maxAge: 1000 * 60 * 60 * 24 * 7, //  mSec
    }
}

app.use(session(sessionConfig));
app.use(flash());
app.use(
    helmet()
);

const scriptSrcUrls = [
    "https://cdn.jsdelivr.net/",
    "https://stackpath.bootstrapcdn.com/",
    "https://kit.fontawesome.com/",
    // "https://code.jquery.com/",
    "https://cdnjs.cloudfare.com/",
    "https://cdn.jsdelivr.com/",
];

const styleSrcUrls = [
    "https://cdn.jsdelivr.net/",
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];

const connectSrcUrls = [];

const fontSrcUrls = [];

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dmzdxxp1k/",
                "https://images.unsplash.com/"
            ],
            fontSrc: ["'self'", ...fontSrcUrls]
        }
    })
)


app.use(passport.initialize()); //
app.use(passport.session()); //
passport.use(new LocalStrategy(User.authenticate())); //

passport.serializeUser(User.serializeUser()); //
passport.deserializeUser(User.deserializeUser()); //


app.use((req, res, next) => {
    // console.log(req.session)
    console.log(req.query)
    res.locals.currentUser = req.user; // 
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//
app.use('/', userRoutes);

//
app.use('/campgrounds', campgroundRoutes);

//
app.use('/campgrounds/:id/reviews', reviewRoutes);

// 
app.get('/', (req, res) => {
    res.render('home');
})



//
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})


//
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) {
        message = 'Oh no, Something went wrong!!!'
    }
    res.status(statusCode).render('error', { err });
})


//
app.listen(3000, () => {
    console.log('Serving on port 3000');
})



// POST: /campgrounds/:id/reviews