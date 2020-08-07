const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const posductRouter= require('./api/routs/products')
const orderRouter = require('./api/routs/orders')
const userRouter = require('./api/routs/users')


const app = express() 
app.use(morgan('dev'))
// make 'uploads' file available 
app.use('/uploads', express.static('uploads'))
 
// parse the req body 
app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json())


// DB connection
mongoose.connect(
    'mongodb+srv://ahmedel:3179931mlab@cluster0.fler2.mongodb.net/Cluster0?retryWrites=true&w=majority',
    { useNewUrlParser: true ,useUnifiedTopology: true },
    ()=>console.log('DB conncted')
)

// handle cors errors => we will sent a header to the host that runs the client app 
// to let him have access to our API which runs on other host 
app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*')
    res.header
        ('Access-Control-Allow-Origin',
        'Origin, X-Requested-With, Content-Type, Accept, Authorrization')
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Origin', 'PUT, POST, GET, PATCH, DELETE')
        return res.status(200).json({})
    }
    next()
}) 


// Routs
app.use('/products', posductRouter)
app.use('/orders', orderRouter)
app.use('/users', userRouter)

//------------------------------------------------------------------/
// handle errors 
// this will handle any request that pass throw the products and orders lines we will catch it here 

app.use((req, res, next)=>{
    const error = new Error('Not Found...')
    res.status = 404
    next(error)
})
// this will catch the err throw from the previous middleware or anywhere in this app 
app.use((error, req, res, next)=>{
    // set th status of the res to the thrown err status or 500
    res.status = error.status || 500
    res.json({
        error : {
            message : error.message // many errs has a message prop 
        }
    })    
})
module.exports  = app 
