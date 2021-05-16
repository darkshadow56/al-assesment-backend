const mongoose=require('mongoose')

var MONGODB_URL = 'mongodb+srv://admin:admin@cluster0.5cl7p.mongodb.net/al?retryWrites=true&w=majority'
mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })
.then((val)=>{console.log("DB connected!",val)})
.catch(err => console.log("DB Error: ",err))
