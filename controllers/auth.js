const User = require("../models/user");

exports.getLogin = (req, res, next) => {
    // const isLoggedIn = req.get("Cookie").split(";")[1].trim().split("=")[1];
    res.render("auth/login", {
        path: "/login",
        pageTitle: "Login",
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

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    })
}