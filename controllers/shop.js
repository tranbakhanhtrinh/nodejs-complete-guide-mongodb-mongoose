const Product = require("../models/product");

exports.getIndex = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render("shop/index", {
                pageTitle: "Shop",
                prods: products,
                path: '/',
            })
        })
        .catch(err => { console.log(err) });
}

exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render("shop/product-list", {
                pageTitle: "Shop",
                prods: products,
                path: '/products',
            })

        })
        .catch(err => { console.log(err) });
}
exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            res.render("shop/product-detail", {
                product: product,
                pageTitle: product.title,
                path: "/products"
            })
        })
        .catch(err => { console.log(err) })

}

exports.getCart = (req, res, next) => {
    req.user.getCart()
        .then(products => {
            res.render("shop/cart", {
                path: "/cart",
                pageTitle: "Your cart",
                products: products
            })
        })
        .catch(err => { console.log(err) });
}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product)
        })
        .then(result => {
            res.redirect("/cart")
        })
        .catch(err => { console.log(err) });
}

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.deleteItemFromCart(prodId)
        .then(result => {
            res.redirect("/cart");
        })
        .catch(err => { console.log(err) });
}

exports.postOrder = (req, res, next) => {
    let fetchedCart;
    req.user.addOrder()
        .then(result => {
            res.redirect("/orders")
        })
        .catch(err => { console.log(err) });
}

exports.getOrders = (req, res, next) => {
    req.user.getOrders()
        .then(orders => {
            res.render("shop/orders", {
                path: "/orders",
                pageTitle: "Your Orders",
                orders: orders
            })
        })
        .catch(err => { console.log(err) });

}