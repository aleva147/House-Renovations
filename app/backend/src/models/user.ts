import mongoose from "mongoose";

let User = new mongoose.Schema({
    username: { type: String },
    password: { type: String },
    phone: { type: String },
    mail: { type: String },
    type: { type: String },
    photoname: { type: String },

    temppass: { type: String },
    validuntil: { type: Date }
})

export default mongoose.model('UserModel', User, 'users')