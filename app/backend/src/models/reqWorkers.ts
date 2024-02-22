import mongoose from "mongoose";

let ReqWorkers = new mongoose.Schema({ 
    id: { type: Number },
    agency: { type: String },
    amount: { type: Number }
})

export default mongoose.model('ReqWorkersModel', ReqWorkers, 'reqWorkers')