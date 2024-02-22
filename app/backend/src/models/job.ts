import mongoose from "mongoose";
import { Room } from "./room";

let Job = new mongoose.Schema({
    id: { type: Number },
    client : { type : String },
    object: { type: Number },
    agency: { type: String },
    type: { type: String },
    status: { type: String },
    starting: { type: String },
    deadline: { type: String },
    cost: { type: Number },
    comment: { type: Number },
    reason: { type: String },
    sketch: { type: Array<Room> }
})

export default mongoose.model('JobModel', Job, 'jobs')