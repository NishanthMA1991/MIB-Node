const router = require('express').Router();
const appRoot = require('app-root-path');
const logger = require(`${appRoot}/config/winston.config.js`);
const ProductCategories =require(appRoot+'/DataModel/ProductCategoriesSchema');
var cache = require('express-redis-cache')(); 

//To add products 
/* URL : /category/add */
router.post('/add', function (req, res) {
    console.log('Inside save Category');

    var categories = new ProductCategories.categories;
    categories.categoryName = req.body.category_name;

    categories.save(function (err, data) {
        if (err) throw err;
        res.json({ "success": "Added", "caregory": data });
    })    
})

//Get All Categories
/* URL : /category */
router.get('/', function (req, res) {
    //console.log('Inside get Category');
    ProductCategories.categories.find({}).then(item => {
        res.status(200).json({ 'category': item});
    })
})


module.exports = router;