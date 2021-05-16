const express=require('express')
const router=express.Router()
const auth=require('../middleware/auth')
const User=require('../models/User')

// Creating users
router.post('/users',async (req,res)=>{
    try {
        console.log(req.body)
    const user=new User(req.body)
    console.log(user)
    const token=await user.generateAuthToken()
    user.tokens=token
    await user.save()
    res.status(201).send({ user,token })
    
}  catch(err) {
    console.log(err)
        res.status(500).send(err)
    }
})

// Logging in Users
router.post('/users/login',async (req,res)=>{
    try {
        const user=await User.findByCredentials(req.body.email,req.body.password)
        console.log(user)
        const token=await user.generateAuthToken()
        
        user.tokens=token
        await user.save()

        res.status(200).send({user,token})
    } catch(err) {
        console.log(err)
        res.status(401).send(err)
    }
})

// Loging out user
router.post('/users/logout',auth,async (req,res)=>{
    try {
        req.user.tokens=' '
        await req.user.save()
     res.send({"msg":"loggedout"})
 }catch(err){
     console.log(err)
     res.status(500).send({error:'Loging out all users'})
 }
})

module.exports=router