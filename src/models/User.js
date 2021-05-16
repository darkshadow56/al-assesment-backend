const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

const userSchema=mongoose.Schema({
    email: {
        type: String,
        trim: true,
        required: true,
        validator(value) {
            if(!validator.isEmail(value)) throw new Error('Invalid Email')
        }
    },

    password: {
        type: String,
        trim: true,
        required: true,
        minlength: 6,
        validator(value) {
            if(value.toLowerCase().includes('password')) throw new Error('Password contains "password" or its length is less than 6') 
        }
    },

    tokens: {
        type: String,
        required: true
    }
})

userSchema.virtual('orders',{
    ref:'Order',
    foreignField:'owner',
    localField:'_id'
})

userSchema.methods.toJSON= function() {

    const user=this
    const userObj=user.toObject()
    delete userObj.tokens
    delete userObj.password
    delete userObj.avatar

    return userObj
}

userSchema.methods.generateAuthToken=async function() {
    const user=this
    const token=jwt.sign({_id: user._id.toString()},process.env.JWT_SECRET)
    return token
}

userSchema.statics.findByCredentials=async function(email, password) {
    const user=await User.findOne({email})

    if(!user) throw new Error('User does not exist or invalid password')

    const isMatch=await bcrypt.compare(password, user.password)

    if(!isMatch) throw new Error('User does not exist or invalid password')

    return user
}

userSchema.pre('save', async function(next){
    const user=this

    if(user.isModified('password')){ 
        user.password=await bcrypt.hash(user.password,8)
}
    next()
})

const User=mongoose.model('User',userSchema)

module.exports=User