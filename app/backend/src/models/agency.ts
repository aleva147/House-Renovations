import mongoose from "mongoose";

let Agency = new mongoose.Schema({
    username: { type: String },
    name: { type: String },
    country: { type: String },
    city: { type: String },
    street: { type: String },
    identification: { type: Number },
    description: { type: String },
    openPositions: { type: Number }
})

export default mongoose.model('AgencyModel', Agency, 'agencies')