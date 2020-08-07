const express = require('express')
const router = express.Router()
const checkAuth = require('../middleware/check_auth')
const multer = require('multer')

const productsCotrollers = require('../controllers/products')

// storage stratgy 
const storage = multer.diskStorage({
    destination :  (req, file, callBack)=> {
        callBack(null, './uploads/')
    },
    filename : (req, file, callBack)=> {
        callBack(null, file.originalname)
    }
})
// file upload distirctions
const filefilter =(req, file, cb)=>{
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
        // save the file 
        cb(null, true) // null means donot throw an err 
    }else { 
        //do not save it 
        cb(new Error('message : file is not supported '), false)
    }
}
// excute multer
const upload = multer({
    storage : storage , 
    limits: {fileSize : 1024 * 1024 *  5 } , // 5 mega bytes 
    filefilter : filefilter
})

// Get all the products 
router.get('/',productsCotrollers.get_all_products )

// Get a spacific Product
router.get('/:poductId',productsCotrollers.get_a_product)
// --------------------------------------------------//
// post new products
router.post('/',upload.single('productImage') ,productsCotrollers.post_a_product)

// update a Product 
router.patch('/:productId', checkAuth,productsCotrollers.patch_a_product)

// DELETE a Product 
router.delete('/:productId',  checkAuth, productsCotrollers.delet_a_product)

module.exports = router
