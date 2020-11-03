const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
    Product.find()
        // .select('title price -_id')  chọn field muốn lấy. thêm dấu "-" trước field ko muốn lấy
        // .populate('userId') lấy những data có liên quan. Vd: lấy userId trong model Product rồi tra trong model User, lấy thông tin user mà có cái userId đó
        .then(products => {
            res.render("admin/products", {
                pageTitle: "Admin Products",
                prods: products,
                path: '/admin/products',
            });
        })
        .catch(err => { console.log(err) });
}

exports.getAddProduct = (req, res, next) => {
    res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: '/admin/add-product',
        editing: false,
    });
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: req.user
    })
    product.save()
        .then(result => {
            console.log("Created product!!");
            res.redirect("/admin/products")
        })
        .catch(err => console.log(err));

}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect("/");
    }
    const prodId = req.params.productId;
    // Product.findByPk(prodId)
    Product.findById(prodId)
        .then(product => {
            if (!product) {
                return res.redirect("/");
            }
            res.render("admin/edit-product", {
                pageTitle: "Edit Product",
                path: '/admin/edit-product',
                editing: editMode,
                product: product,
            });
        })
        .catch(err => console.log(err))
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;
    Product.findById(prodId).then(product => {
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.imageUrl = updatedImageUrl;
        product.description = updatedDescription
        return product.save();
    })
        .then(result => {
            console.log("UPDATED!")
            res.redirect("/admin/products")
        })
        .catch(err => console.log(err))

}

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findByIdAndRemove(prodId)
        .then(result => {
            console.log("DELETED !!!")
            res.redirect("/admin/products");
        })
        .catch(err => console.log(err))

}