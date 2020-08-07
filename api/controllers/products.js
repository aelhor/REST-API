const Product = require('../models/productmodel') 
const mongoose = require('mongoose')

exports.get_all_products = async (req, res)=>{
    try{
        const allProducts = await Product.find().select('_id name price productImage')
        const response = {
            count : allProducts.length,
            allProducts : allProducts.map(product=>{
                return{
                    name : product.name,
                    price : product.price,
                    _id : product._id,
                    productImage : product.productImage,
                    request : {
                        type : 'GET',
                        url : '/products/' + product._id
                    }
                }
            })
        }
        if (allProducts.length > 0 ){
            res.status(200).json(response )
        }
        else{
            res.status(404).json({
                message : 'No Products Found',
            })
        }  
    }
    catch(err) { 
        res.status(404).json({error : err})
    }
}

exports.get_a_product  =  async (req, res)=>{
    const id = req.params.poductId
    try { 
        const spacificProduct = await Product.findById(id)
        if (spacificProduct){
            res.status(200).json({
                message : ' Here Is your Product', 
                product : spacificProduct
            })
        }
        else { 
            res.status(404).json({
                message : 'Product is Not Found', 
                product : spacificProduct
            })
        }
       
    }
    catch(err){
        err.reason = 'product Not Found'
        res.status(404).json({error : err})
    }
}

exports.post_a_product = async(req, res)=>{
    console.log(req.file);
    
    const product = new Product({
        _id : new mongoose.Types.ObjectId(),
        name  : req.body.name, 
        price : req.body.price, 
        productImage : req.file.path  
    })
    // save the new product to DB  
    try{
        const savedproduct = await product.save()
        res.status(201).json({
            message: 'product has been Created',
            createdProduct : {
                name : savedproduct.name,
                price : savedproduct.price,
                _id : savedproduct._id,
                request : {
                    type : 'GET',
                    url : '/products/' + product._id
                }
            }
        })
    }
    catch(err){
        res.status(500).json({error : err})
    } 
}

exports.patch_a_product = async(req, res)=>{
    const id = req.params.productId
    const updateOps = {}
    try{
        for(const ops of req.body){
            updateOps[ops.propName] = ops.value 
        }
        const updated = await Product.update({_id : id}, {$set:updateOps })
        res.status(200).json({message: 'you Update  a Product', updateedProduct : updated})
    }
    catch(err){
        res.status(404).json({error :err})
    }
    // .exec()
    // .then(result=>{
    //     res.status(200).json({message: 'you Update  a Product', updateedProduct : result})
    // })
    // .catch(err=>{
    //     res.status(404).json({error :err})
    // })
}

exports.delet_a_product =  async(req, res)=>{
    const id = req.params.productId
    try{
       const deletedProduct =  await Product.remove({_id : id})
        res.status(200).json({
            message : 'you Delete a Product', 
            deletedProduct : deletedProduct
        })
    }
    catch(err){
        res.status(500).json({error : err})
    }
    // Product.remove({_id : id})
    // .exec().
    // then(result=> {
    //     res.status(200).json(result)
    // })
    // .catch(err =>{
    //     res.status(500).json({
    //         error : err
    //     })
    // })
}