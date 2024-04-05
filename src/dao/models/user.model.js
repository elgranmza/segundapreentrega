import mongoose from "mongoose";

const collection = "User"

const userSchema = new mongoose.Schema({

    first_name: String,
    last_name: String,
    email:{
        type: String,
        unique:true
    },
    age:Number,
    password:String,
    cart:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"carts"
    },
    role: {
        type: String,
        default:"User"
    }
})

const userModel = mongoose.model(collection,userSchema)

export default userModel