const router = require('express').Router();
const appRoot = require('app-root-path');
const logger = require(`${appRoot}/config/winston.config.js`);
const ProductCategories = require(appRoot + '/DataModel/ProductCategoriesSchema');
const UserCartDetails = require(appRoot + '/DataModel/UserCartDetailsSchema');
var cache = require('express-redis-cache')();
const jwt = require(`${appRoot}/jwtAuth/jwtAuth.js`);
var async = require('async');

//To get products
/* URL : /product */
router.get('/', cache.route('mib:allproducts', 36000), (req, res) => {
    ProductCategories.productDetails.find()
        .populate('category_id')
        .exec(function (err, products) {
            res.status(200).json({ 'products': products });
        });
});

//To get products using id
/* URL : /product/id */
router.get('/:id', (req, res) => {
    let id = req.params.id;

    ProductCategories.productDetails.find({ _id: id })
        .populate('category_id')
        .exec(function (err, product) {
            res.status(200).json({ 'product': product });
        });
});

//To get products by category id
/* URL : /product/filter */
router.post('/filter', (req, res) => {
    let categories = req.body.category_id;
    //let categories = ["5b1e592f83e5c53b2c2e5790","5b1e4b10e08a0208d0035ea3"];
    ProductCategories.productDetails.find({ category_id: { $in: categories } }).populate('category_id').exec((err, products) => {
        res.status(200).json({ 'products': products });
    })
});

//To add products 
/* URL : /product/add */
router.post('/add', (req, res) => {
    let product = req.body;
    ProductCategories.productDetails.find({ name: product.name }, (err, count) => {
        if (count.length) {
            res.status(405).json({ 'error': 'Product already exists' });
        } else {
            ProductCategories.productDetails(product).save((err, data) => {
                if (err) {
                    let errorMsg = [];
                    if (err.name == 'ValidationError') {
                        for (field in err.errors) {
                            errorMsg.push(err.errors[field].message);
                        }
                    } else if (err.name == 'MongoError') {
                        res.json({ 'error': err });
                    }
                } else {
                    res.json({ "success": "Added", "Product": data });
                }
            });
        }
    });
});

router.put('/update', (req, res) => {

    var id = req.body.id;
    var product = req.body;

    Products.update({ _id: id }, product, function (err, result) {

        if (err) {
            res.json({ 'message': err });
        } else {
            res.json({ 'success': 'updated successfully', 'data': result });
        }

    });

});

router.delete('/delete/:id', (req, res) => {

    var id = req.params.id;

    Products.findByIdAndRemove(id, (err, result) => {
        if (err) {
            res.json({ 'message': err });
        } else {
            res.json({ 'success': 'deleted successfully', 'data': result });
        }
    });
});

// add products to cart
/* URL : /product/cart */
router.post("/cart", (req, res) => {
    var token = req.headers.authentication;
    var returnedToken = jwt.verifyToken(token);
    //console.log("returnedToken : "+JSON.stringify(returnedToken));

    var cartDetails = new UserCartDetails.cartDetails;
    cartDetails.userID = req.body.userID;
    cartDetails.products = { product_id: req.body.productID, quantity: req.body.qty }

    cartDetails.save(function (err, data) {
        if (err) {
            console.log("err " + JSON.stringify(err));
            if (err.hasOwnProperty('errmsg')) {
                if (err.errmsg.indexOf("duplicate key error collection") > 0) {
                    res.status(500).json("Product already added to cart!!!");
                }
                else {
                    res.status(500).json({ 'error': "Internal server error!!!" });
                }
            }
            else {
                res.status(500).json({ 'error': "Internal server error!!!" });
            }

        } else {
            res.status(200).json({ 'message': 'Product added to cart!!!' });
        }
    });
});

// add products to cart
/* URL : /product/getcart */
router.post("/getcart", (req, res) => {
    console.log("Came to getcart");
    var token = req.headers.authentication;
    var returnedToken = jwt.verifyToken(token);
    //console.log("returnedToken : "+JSON.stringify(returnedToken));

    UserCartDetails.cartDetails.find(req.body)
        .populate('products.product_id')
        .exec(function (err, cart) {
            let sum = 0;
            for (i = 0; i < cart.length; i++) {
                sum += cart[i].products[0].product_id['price'];
            }
            if (cart.length != 0) {
                res.status(200).json({ 'cart': cart, 'sum': sum });
            } else {
                res.status(200).json({ 'message': 'No products in the cart' });
            }
        });
});

//To delete products from cart
/* URL : /product/cart/delete */
router.post('/cart/delete', (req, res) => {

    var token = req.headers.authentication;
    var returnedToken = jwt.verifyToken(token);

    var conditions = { $and: [{ userID: { $eq: req.body.userID } }, { 'products.product_id': { $eq: req.body.product_id } }] };

    UserCartDetails.cartDetails.findOneAndRemove(conditions, (err, result) => {
        if (err) {
            res.json({ 'message': err });
        } else {
            res.json({ 'success': 'Product deleted successfully!!!', 'data': result });
        }
    });
});

// add products to cart
/* URL : /product/getcart */
router.post("/getcart", (req, res) => {
    console.log("Came to getcart");
    var token = req.headers.authentication;
    var returnedToken = jwt.verifyToken(token);
    //console.log("returnedToken : "+JSON.stringify(returnedToken));

    UserCartDetails.cartDetails.find(req.body)
        .populate('products.product_id')
        .exec(function (err, cart) {
            let sum = 0;
            for (i = 0; i < cart.length; i++) {
                sum += cart[i].products[0].product_id['price'];
            }
            if (cart.length != 0) {
                res.status(200).json({ 'cart': cart, 'sum': sum });
            } else {
                res.status(200).json({ 'message': 'No products in the cart' });
            }
        });
});

//To delete products from cart
/* URL : /product/order */
router.post('/order', (req, res) => {

    var token = req.headers.authentication;
    var returnedToken = jwt.verifyToken(token);

    var  user_id  =  req.body.userID;
    console.log(" user_id : "+ user_id);
    UserCartDetails.cartDetails.find({ userID: user_id })
        .populate('products.product_id') 
        .exec(function  (err,  products) {
            console.log("products : "+JSON.stringify(products));
            let  sum  =  0;
            let  products_price  =  [];
            let  products_from_cart  =  [];
            let  quantity  =  [];
            let productUpdate = [];
            for (i  =  0; i < products.length; i++) {
                products_from_cart.push(products[i].products[0].product_id['_id']);
                products_price.push(products[i].products[0].product_id['price']);
                quantity.push(1);
                sum  +=  products[i].products[0].product_id['price'];
                let val = {"id":products[i].products[0].product_id['_id'],"qty":products[i].products[0].product_id['quantity']}
                productUpdate.push(val);
            }

            let  prod  =  { 'product_id': products_from_cart, 'quantity': quantity, 'price': products_price };
            
            let  order  =  { 'products':  prod, 'total': sum, 'user_id': user_id, 'order_status': 'Processed' };
            console.log(" prod : "+ JSON.stringify(prod));
            console.log(" order : "+ JSON.stringify(order));
            console.log("productUpdate : "+ JSON.stringify(productUpdate));
            console.log("Length : "+productUpdate.length)

            async.parallel({
                updateQty:  async function  (cb) 
                { 
                    console.log("updateQty");
                    var fun = function(){
                        for (var index = 0; index < productUpdate.length; index++) {
                            var element = productUpdate[index];
                            console.log("element : "+element);
                            var p_qty = parseInt(element.qty)-1;
                            ProductCategories.productDetails.findOneAndUpdate({ _id: element.id }, {
                                quantity : p_qty,
                            });
                        }
                    }
                    await fun();
                    cb; 
                },
                saveOrder:  function (cb) 
                { 
                    console.log("saveOrder");
                    var orderDetails = new UserCartDetails.orderDetails;
                    orderDetails.user_id = req.body.userID;
                    orderDetails.products =  prod;
                    orderDetails.total = sum;
                    orderDetails.order_status = 'completed';

                    orderDetails.save(cb);
                },
                cartRemove:  function  (cb) 
                { 
                    console.log("cartRemove");
                    UserCartDetails.cartDetails.remove({ userID: user_id }, cb);
                }
            },  function (err,  result) {
                if  (err) {
                    console.log("err : "+err);
                    res.status(500).json({ 'error': "Internal server error!!!" });
                    return;
                }
                else{
                    res.status(200).json({ 'success': 'Order places successfully!!!' });
                    return;
                }
            });
        });
});

module.exports = router;