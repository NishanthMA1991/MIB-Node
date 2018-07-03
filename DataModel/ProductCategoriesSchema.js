var mongoose = require('mongoose');
var schema = mongoose.Schema;

var categoriesSchema = new schema({
    categoryName: String
})

var productDetailsSchema = new schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'Product name is must']
    },
    quantity: {
        type: Number,
        required: [true, 'Product quantity is must']
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories',
        required: [true, 'Catergory is must']
    },
    description: {
        type: String
    },
    image: {
        type: String,
        required: [true, 'Product image is must']
    },
    price: {
        type: Number,
        required: [true, 'Product price is must']
    },
    flag: {
        type: Boolean,
        default: true
    }
})

var productDetails = mongoose.model('products', productDetailsSchema);
var categories = mongoose.model('categories', categoriesSchema);

module.exports = {
    productDetails: productDetails,
    categories: categories
};