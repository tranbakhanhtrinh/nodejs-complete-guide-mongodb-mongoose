const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const adminRoute = require('./routes/admin');
const shopRoute = require('./routes/shop');
const User = require('./models/user');

const errorController = require("./controllers/error");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views"); // the second param is the name of folder "views"

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')))
// console.log(path.join(__dirname));

app.use((req, res, next) => {
    User.findById("5f98f993b0d98c104acf9c8e")
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => { console.log(err) })
})

app.use("/admin", adminRoute); // if we add the first argument, the routes in adminRoute will automatically add a prefix /admin
app.use(shopRoute);

app.use(errorController.get404);

const port = process.env.PORT || 3000;

mongoose.connect("mongodb+srv://tranbakhanhtrinh:airblade08@nodejs-complete-guide.fqrra.mongodb.net/nodejs-complete-guide-mongo-mongoose?retryWrites=true&w=majority")
    .then(result => {
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: "Trinh",
                    email: "test@test.com",
                    cart: {
                        items: []
                    }
                })
                user.save();
            }
        })

        app.listen(port, () => {
            console.log(`Server is runnig on port ${port}`);
        })
    }).catch(err => console.log(err));