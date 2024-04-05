import {Router} from "express"
import userModel from "../dao/models/user.model.js"
import productsModel from "../dao/models/products.model.js";
import cartsModel from "../dao/models/carts.model.js";

import CartManagerDB from "../dao/dbManagers/CartManagerDB.js";
import ProductManagerDB from "../dao/dbManagers/ProductManagerDB.js";

const cartManagerMongo = new CartManagerDB();
const productManagerMongo = new ProductManagerDB();

const router = Router();

const publicAccess = (req,res,next)=>{
    if(req.session.user){
        return res.redirect("/")
    }
    next();
}

const privateAccess = (req,res,next)=>{
    if(!req.session.user){
        return res.redirect("/login")
    }
    next();
}

router.get("/",privateAccess,(req,res)=>{
    res.render("profile",{user:req.session.user})
})

router.get("/login",publicAccess,(req,res)=>{
    res.render("login")
})

router.get("/register",publicAccess,(req,res)=>{
    res.render("register")
})

router.get("/usuarios",async(req,res)=>{
    const users = await userModel.find().lean();
    res.render("users",{users,isAdmin:true})

})

router.get("/products",privateAccess,async(req,res)=>{
    
        const {limit,page,sort,category,status,price}=req.query;

        //para realizar ordenamiento ascendente o descendente por precio, en caso de no recibir sort, no realizar ningún ordenamiento
        const preSort = sort ? {price:sort === "asc" ? 1:-1} : {};

        const options = {
            limit: limit ? limit:10,
            page: page ? parseInt(page) : 1,
            sort:preSort,
            lean:true

        }

        const filter = category?{category}:{};

    const result = await productManagerMongo.getProducts(filter,options);
    

    if(result.msg.hasPrevPage)
        {
            result.msg.prevPage =`http://localhost:8080/products?page=${options.page -1 }`;
        }

    if(result.msg.hasNextPage)
        {
            result.msg.nextPage =`http://localhost:8080/products?page=${options.page +1 }`;
        }

    
    // Agregamos a cada producto el cid, porque tube problemas con handlebars al leer la propiedad de otras formas.
    for(const data of result.msg.docs)
    {
        data.cid="658cbaa3b299fdafc649721c";
    }

    console.log(result.msg);
    res.render("products",{msg:result.msg,user:req.session.user})

})

router.get("/carts/:cid",async(req,res)=>{
    const cid= req.params.cid;
    const carts = await cartManagerMongo.getCartsByID(cid);
    console.log(carts)
    res.render("carts",{carts})

})

router.get("/chat",async(req,res)=>{
    //const chat = await chatModel.find().lean();
    res.render("chat",{})

})

export default router;