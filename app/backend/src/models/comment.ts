import mongoose from "mongoose";

let Comment = new mongoose.Schema({
    id: { type: Number },
    username : { type : String },
    agency: { type: String },
    text: { type: String },
    grade: { type: Number }
})

export default mongoose.model('CommentModel', Comment, 'comments')