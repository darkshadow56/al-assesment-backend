const express=require('express')
const router=express.Router()
const auth=require('../middleware/auth')
const Order=require('../models/Order')

router.post('/orders',auth,async (req,res)=>{
    const order=new Order({...req.body,owner:req.user._id})
    try {
        await order.save()
        console.log("order created! 123")
        res.status(201).send(order)
    } catch(err) {
        res.status(500)
    }
})

// Displaying orders
router.get('/orders/display',auth,async (req,res)=>{

        try {
            await req.user.populate({
                path: 'orders',
    
            }).execPopulate()
            console.log(req.user)
            res.status(200).send(req.user.orders)

        } catch(err) {
            console.log(err)
            res.status(404).send(err)
        }
})

// updating orders
router.put('/orders/update/:id', auth,async (req,res)=>{
    const prop=['orderName','orderQuantity','orderStatus']
    const keys=Object.keys(req.body)

    const operationValid=keys.every(val=> prop.includes(val))

    if(!operationValid) return res.status(401).json({"Error":"Invalid Operation"})

    try {
        const order=await Order.findOne({ _id:req.params.id, owner: req.user._id})
        if(!order) return res.status(404).json({"Error":"Order not found"})
   
        keys.forEach(val=>order[val]=req.body[val])

        await order.save()
        console.log("order updated!")
        res.status(200).json(order)
    } catch(err) {

    }
})

// Deleting order
router.delete('/orders/:id',auth,async (req,res)=>{
    try {
        const order=await Order.findOneAndDelete({ _id: req.params.id,owner:req.user._id })

        if(!order) return res.status(404).json({"Error":"Order not found"})

        res.status(200).send(order)
    } catch(err) {
        console.log(err)
        res.status(500).send({"Error":"Couldn't delete order"})
    }
})

module.exports=router