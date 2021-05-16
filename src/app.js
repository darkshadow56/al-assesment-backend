const express=require('express')
const app=express()
require('./db/mongoose')
const cors=require('cors')

const userRoutes=require('./routers/users')
const orderRoutes=require('./routers/orders')

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: false }))

app.use(userRoutes)
app.use(orderRoutes)

module.exports=app
