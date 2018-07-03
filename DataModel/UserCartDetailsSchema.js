var mongoose = require('mongoose');
var schema = mongoose.Schema;

var cartSchema = new schema({
    userID: {
        type: String,
        required: true
    },
    products: [
        {
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products',
                unique: true
            },
            quantity: Number
        }
    ]

})

var orderDetailsSchema = new schema({
    user_id: {
        type: String,
        required: true
    },
    products:  [{
        product_id:  [String],
        price:  [Number],
        quantity:  [Number],
    }],
    total: {
        type: Number,
        required: true
    },
    order_status: {
        type: String,
        required: true
    },
    flag: {
        type: Boolean,
        default: true
    }
})

var cartDetails = mongoose.model('cartDetails', cartSchema);
var orderDetails = mongoose.model('orderDetails', orderDetailsSchema);

module.exports = {
    cartDetails: cartDetails,
    orderDetails: orderDetails
};