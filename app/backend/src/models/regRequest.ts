import mongoose from "mongoose";

let RegRequest = new mongoose.Schema({ 
    id: { type: Number },
    username: { type: String },
    password: { type: String },
    phone: { type: String },
    mail: { type: String },
    type: { type: String },
    photoname: { type: String },

    firstname: { type: String },
    lastname: { type: String },

    name: { type: String },
    country: { type: String },
    city: { type: String },
    street: { type: String },
    identification: { type: Number },
    description: { type: String },

    status: { type: String }
})

export default mongoose.model('RegRequestModel', RegRequest, 'regRequests')