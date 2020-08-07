const mongoose = require('mongoose')
const bycrpt = require('bcrypt')
const User = require('../models/usermodel')
const jwt = require('jsonwebtoken')

exports.user_signUp = async (req, res)=> {
    // check if the user is not exist 
    try{
        const userExist = await User.find({email : req.body.email})
        if (userExist.length >= 1) { 
             res.status(422).json({message : 'usre is already exist'})
        }
        else { 
            bycrpt.hash(req.body.password, 10, async(err, hash)=>{
                if (err) { 
                    res.status(500).json({error : err})
                }
                else { 
                    const user = new User( {
                        _id : new mongoose.Types.ObjectId, 
                        email : req.body.email, 
                        password :hash
                    })
                    try{
                        const savedUser = await user.save()
                        res.status(200).json({
                            message : 'new user created successfully', 
                            newUser : savedUser
                        })
                    }catch(err){
                        res.status(500).json({error : err})
                    }
                }
        
            })
        }
        
    }catch(err) { 
         res.status(500).json({ error : err})
    }
}

exports.user_logIn = (req, res)=> {
    User.find({email : req.body.email})
    .exec()
    .then(user=> {
        if(user.length < 1) { 
            return res.status(401).json({message : 'Auth failed'})
        }else{ 
            // user exist but we should check sent is correct (is the same in db)
            bycrpt.compare(req.body.password, user[0].password , (err, compareRes)=> {
                if(err){
                    // err if the compare operation is generaly failed 
                   return res.status(401).json({message : 'Auth failed'})
                }
                if(compareRes) { // means password is correct 
                    //init a token thet will be sentto the client 
                    const token = jwt.sign({
                        email : user[0].email, 
                        userId : user[0]._id
                    },
                    process.env.JWT_KEY, 
                    {
                        expiresIn : '1h'
                    })
                    return res.status(200).json(
                        {
                            message : 'Auth sucesseded', 
                            token : token
                         })
                }
                // means the compare operation went good but the password is incorrect
                return res.status(401).json({message : 'Auth failed'})
            })
        }
    })
    .catch(err =>{
        res.status(500).json({
            error : err
        })
    })
}

exports.user_delete = (req, res)=>{ 
    // try{
    //     const userExist = await User.remove({_id : req.params.id})
    //     res.status(200).json({
    //         message : 'User Deleted Sucessfullt', 
    //         deleedUser : userExist
    //     })
    // }
    // catch(err) { 
    //     res.status(404).json({error : err})
    // }
    User.remove({_id : req.params.id})
    .exec()
    .then(result=> {
        res.status(200).json(result)
    })
    .catch(err =>{
        res.status(500).json({
            error : err
        })
    })
}

exports.get_all_users = async(req, res)=>{
    try{
        const allUsers = await User.find()
        res.status(200).json({allUsers : allUsers})
    }
    catch(err){ 
        res.json({ error : err })
    }
}