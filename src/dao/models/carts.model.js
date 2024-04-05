import mongoose from "mongoose";

const collection = "Carts"

const cartsSchema = new mongoose.Schema({

    products:[{
        product:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Products",
            require:true
        },
        quantity:{
            type: Number,
            requiere:true,
            default:1
        }
    }]
})

cartsSchema.pre("find",function(){
    this.populate("products.product")
})

cartsSchema.pre("findOne",function(){
    this.populate("products.product")
})

const cartsModel = mongoose.model(collection,cartsSchema)

export default cartsModel