import mongoose from "mongoose";

const collection = "Messages"

const messagesSchema = new mongoose.Schema({

    user: String,
    message: String
})

const messagesModel = mongoose.model(collection,messagesSchema)

export default messagesModel