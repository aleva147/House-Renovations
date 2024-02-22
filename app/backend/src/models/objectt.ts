import mongoose from "mongoose";
import { Room } from "./room";

let Objectt = new mongoose.Schema({
    id: { type: Number },
    client : { type : String },
    type: { type: String },
    address: { type: String },
    numOfRooms: { type: Number },
    sqFootage: { type: Number },
    sketch: { type: Array<Room> }
})

export default mongoose.model('ObjecttModel', Objectt, 'objectts')