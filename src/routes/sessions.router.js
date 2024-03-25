import {Router} from "express"
import userModel from "../dao/models/user.model.js";
import {createHash,validatePassword} from "../utils.js"
import passport from "passport";


const router = Router();

router.post("/register",passport.authenticate("register",{failureRedirect:"/api/sessions/failregister"}),async (req,res)=>{
    res.send({
        status:"success",
        message:"usuario registrado"
    })

})

router.get("/failregister",async (req,res)=>{
    console.log("Fallo el registro")
    res.send({error:"fallo en el registro"})
})

router.post("/login", passport.authenticate("login", {failureRedirect:'/api/session/faillogin'}),async (req,res)=>{
    
        console.log("req.user: ",req.user);

        if(!req.user){
            return res.status(400).send({
                status:"error",
                error:"Datos incorrectos"
            })
        }

        //Aca creamos la session?
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age
        }

        res.send({
        status:"success",
        payload:req.session.user,
        message:"Mi primer login!"
    })

})

router.get("/faillogin",async (req,res)=>{
    console.log("Fallo el login")
    res.send({error:"fallo en el login"})
})

router.get("/logout",(req,res)=>{
    console.log("Antes:",req.session)
    req.session.destroy((err)=>{
        if(err)
        {
            console.log("Error: ", err)
            return res.status(500).send({
                status: "error",
                error: "No se pudo desloguear"
            })
        }
        res.redirect("/login")
    })
    console.log("Despues:",req.session)
})

router.get("/github",passport.authenticate("github",{scope:["user:email"]}),async(req,res)=>{})
router.get("/githubcallback",passport.authenticate("github",{failureRedirect:"/login"}),async(req,res)=>{
    req.session.user = req.user;
    res.redirect("/products");
})

export default router