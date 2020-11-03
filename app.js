const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require('express-session');
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const adminRoute = require('./routes/admin');
const shopRoute = require('./routes/shop');
const authRoute = require('./routes/auth');
const User = require('./models/user');

const errorController = require("./controllers/error");

const MONGODB_URI = "mongodb+srv://tranbakhanhtrinh:airblade08@nodejs-complete-guide.fqrra.mongodb.net/nodejs-complete-guide-mongo-mongoose?retryWrites=true&w=majority"

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: "sessions"
});

const csrfProtection = csrf();

app.set("view engine", "ejs");
app.set("views", "views"); // the second param is the name of folder "views"

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store
}))

//csrf uses session by default so put csrf under session.
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next()
        })
        .catch(err => { console.log(err) })
})

app.use((req, res, next) => {
    //locals is used to pass variables to all views.
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})

app.use("/admin", adminRoute); // if we add the first argument, the routes in adminRoute will automatically add a prefix /admin
app.use(shopRoute);
app.use(authRoute);

app.use(errorController.get404);

const port = process.env.PORT || 3000;

mongoose.connect(MONGODB_URI)
    .then(result => {
        app.listen(port, () => {
            console.log(`Server is runnig on port ${port}`);
        })
    }).catch(err => console.log(err));