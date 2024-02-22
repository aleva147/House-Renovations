import mongoose from "mongoose";

let Worker = new mongoose.Schema({
    id: { type: Number },
    agency: { type: String },
    firstname: { type: String },
    lastname: { type: String },
    phone: { type: String },
    mail: { type: String },
    field: { type: String },
    job: { type: Number }
})

export default mongoose.model('WorkerModel', Worker, 'workers')