import mongoose from "mongoose";

let Client = new mongoose.Schema({
    username: { type: String },
    firstname: { type: String },
    lastname: { type: String }
})

export default mongoose.model('ClientModel', Client, 'clients')