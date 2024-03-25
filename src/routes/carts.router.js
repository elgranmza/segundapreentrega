import {Router} from "express"
import CartManagerDB from "../dao/dbManagers/CartManagerDB.js";


const router = Router();

const cartManagerMongo = new CartManagerDB();


router.get("/",async(req,res)=>{
    const carts = await cartManagerMongo.getCarts();
    res.send({
        status: "success",
        message: carts
    })
})

//Se listara los productos de un carrito en especifico
router.get("/:cid",async(req,res)=>{
    const cid= req.params.cid;
    const cart = await cartManagerMongo.getCartsByID(cid);
    res.send({
        status: "success",
        message: cart
    })

})

//Se creará un nuevo carrito
router.post("/",async(req,res)=>{

    const result = await cartManagerMongo.createCart();

    res.send({
        status: "success",
        message: result
    })

})

//Se agregará un producto a un carrito existente.
router.post('/:cid/product/:pid', async (req,res)=>{

    const cid= req.params.cid;
    const pid= req.params.pid;
    //const quantity=req.params.quantity;
    const quantity= 1

    const result = await cartManagerMongo.addProductInCart(cid,pid,quantity)

    res.send({
         status: "success",
         message: result
    })
})

router.delete('/:cid/product/:pid', async (req,res)=>{

    const cid= req.params.cid;
    const pid= req.params.pid;

    const result = await cartManagerMongo.deleteProductInCart(cid,pid)

    res.send({
         status: "success",
         message: result
    })
})

router.put('/:cid', async (req,res)=>{

    const cid= req.params.cid;
    const products=req.body;// products es un array de productos

    const result = await cartManagerMongo.updateCart(cid,products)

    res.send({
         status: "success",
         message: result
    })
})

router.put('/:cid/product/:pid', async (req,res)=>{

    const cid= req.params.cid;
    const pid= req.params.pid;
    const quantity=req.body.quantity;

    const result = await cartManagerMongo.updateQualityProduct(cid,pid,quantity)

    res.send({
         status: "success",
         message: result
    })
})

router.delete('/:cid', async (req,res)=>{

    const cid= req.params.cid;

    const result = await cartManagerMongo.deleteAllProductsInCart(cid)

    res.send({
         status: "success",
         message: result
    })
})


export default router