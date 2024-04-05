import express from "express"
import session from "express-session"
import MongoStore from "connect-mongo"
import mongoose from "mongoose"

import{engine} from "express-handlebars"
import __dirname from "./utils.js"
import {Server} from "socket.io"
import messagesModel from "./dao/models/messages.model.js";

import cartsRouter from "./routes/carts.router.js"
import usersRouter from "./routes/users.router.js"
import viewRouter from "./routes/views.router.js"
import productsRouter from "./routes/products.router.js"
import sessionRouter from "./routes/sessions.router.js"

import passport from "passport"
import inicializePassport from "./config/passport.config.js"

//import cookieParser from "cookie-parser"
//import productsModel from "./dao/models/products.model.js"
//import productCarga from "./files/bd.js"

const PORT = 8080;
const app = express();

const MONGO = "mongodb+srv://elgranmza:mGUlbTxmcEKrrSYs@codercluster.vkyyzkg.mongodb.net/ecommerce"
const connection = mongoose.connect(MONGO);

//const resultCarga = await productsModel.insertMany(productCarga)
//console.log(resultCarga)

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(session({
    store: new MongoStore({
        mongoUrl:MONGO,
        ttl:3600
    }),
    secret:"CoderSecret",
    resave:false,
    saveUninitialized:false
}))

const httpServer = app.listen(PORT, ()=>console.log(`Servidor funcionando en el puerto: ${PORT}`))

const io= new Server(httpServer);

app.engine("handlebars",engine());
app.set("view engine","handlebars");
app.set("views",__dirname+"/views");

app.use(express.static(__dirname + "/public"))

inicializePassport();
app.use(passport.initialize())
app.use(passport.session());

//Rutas
app.use("/api/carts",cartsRouter);
app.use("/api/products",productsRouter);
app.use("/api/users",usersRouter)
app.use("/api/sessions",sessionRouter)
app.use("/",viewRouter)

//websocket
let messages =[]
io.on("connection", async (socket)=>{
    console.log("nuevo cliente conectado")
    messages = await messagesModel.find();
    io.emit("messageLogs",messages);  
    socket.on("message",async(data)=>{
        const result = await messagesModel.create(data);
        messages.push(data);
        io.emit("messageLogs",messages);
    })  
})


