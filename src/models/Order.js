const mongoose=require('mongoose')

const orderSchema=mongoose.Schema({
    orderName:{
        type: String,
        required: true,
        trim: true
    },

    orderQuantity:{
        type: Number,
        required: true,
        trim: true,
        default: 1
    },

    orderStatus:{
        type: String,
        trim: true,
        required: true
    },

    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},
{
    timestamps: true
})

const Order=mongoose.model('Order',orderSchema)

module.exports=Order