const Order = require('../models/ordermodel')
const Product = require('../models/productmodel')
const mongoose = require('mongoose')


exports.get_all_ordres = async(req, res)=>{
    try{ 
        const allOrders = await Order.find().select('_id quantity productId')
        .populate('productId','_id name')
        const response = {
            count : allOrders.length,
            allOrders : allOrders.map(order=> {
                return { 
                    _id : order._id,
                    productId : order.productId, 
                    quantity : order.quantity , 
                    request : {
                        type : 'GET', 
                        url : '/orders/' +order._id
                    }
                }
            })
        }
        if (allOrders.length > 0 ){
            res.status(201). json({response})
        }
        else{
            res.status(201). json({message : 'No Orders Found'})
        }
    }
    catch(err) { 
        res.status(404).json({error : err})
    }
}

exports.get_an_order = async (req, res)=>{
    const id  = req.params.id 
    try{
        const spacificOrder = await Order.findById(id).populate('productId','_id name price')
        if (spacificOrder){
            res.status(201).json({
                message : 'here is your order ', 
                order : spacificOrder
            })
        }
        else{
            res.status(404).json({
                message : 'Order is Not Found'
            })
        }
        
    }
    catch(err){
        res.status(404).json({error : err})
    }
}

exports.post_an_order = async (req, res)=>{
    // check that the product id we are orders is slerady exsit 
    // id = req.body.productId               *it is working without these 2 lines 
    // const idFounded = Product.findById(id)
    // if (idFounded){
        const newOrder = new Order ({
            _id :new mongoose.Types.ObjectId() ,
            productId: req.body.productId,
            quantity : req.body.quantity
        })
        try{
            const savedOrder = await newOrder.save()
            res.status(201).json({
                message : 'You Post an Order',
                order : {
                    _id : savedOrder._id,
                    productId : savedOrder.productId, 
                    quantity : savedOrder.quantity
                }, 
                request : {
                    type : 'GET', 
                    url : '/orders/' + savedOrder._id 
                }
            })
        }
        catch(err){
            res.status(500).json({Ourmessage : 'Invalid Id for this  product',  error : err})
        }
    // }
    // else{
    //     res.status(500).json({error : 'product you are tring to order is not Found'})
    // }
}

exports.delete_an_order =  async(req, res)=>{
    try {
        const deletedorder = await Order.remove({_id : req.params.id})
        res.status(200).json({
            message : ' Order deleted Sucessfully',
            deletedorder : deletedorder
        })
    }
    catch(err){
        res.status(404).json({error : err})
    }
}