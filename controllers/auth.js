const User = require("../models/user");
const bcryptjs = require('bcryptjs');

exports.getLogin = (req, res, next) => {
    // const isLoggedIn = req.get("Cookie").split(";")[1].trim().split("=")[1];
    res.render("auth/login", {
        path: "/login",
        pageTitle: "Login",
        isAuthenticated: false
    })
}

exports.getSignup = (req, res, next) => {
    res.render("auth/signup", {
        path: "/signup",
        pageTitle: "Sign Up",
        isAuthenticated: false
    })
}

exports.postLogin = (req, res, next) => {
    User.findById("5f98f993b0d98c104acf9c8e")
        .then(user => {
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.save(err => {
                console.log(err);
                res.redirect("/")
            })
        })
        .catch(err => { console.log(err) })
}

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    User.findOne({ email: email })
        .then(userDoc => {
            if (userDoc) {
                return res.redirect('/signup')
            }
            return bcryptjs
                .hash(password, 12) //12 is a round to enscrypt password
                .then(hashedPassword => {
                    const user = new User({
                        email: email,
                        password: hashedPassword,
                        cart: { items: [] }
                    })
                    return user.save()
                })
                .then(result => {
                    res.redirect('/login');
                })
        })
        .catch(err => { console.log(err) })
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    })
}