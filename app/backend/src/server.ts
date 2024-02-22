import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import userRouter from './routers/user.router';
import multer from 'multer'
import agencyRouter from './routers/agency.router';
import clientRouter from './routers/client.router';
import adminRouter from './routers/admin.router';
import objecttRouter from './routers/objectt.router';


// For photo uploads:
// Photos are stored on the server, in the "uploads" folder, using multer.
// When users request photos, they are encoded using base64 conversion and sent to the frontend. 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({
    storage: storage
})



const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/projekat')
const connection = mongoose.connection
connection.once('open', ()=>{
    console.log('db connected')
})

const router = express.Router();
router.use('/users', userRouter);
router.use('/agencies', agencyRouter);
router.use('/clients', clientRouter);
router.use('/admins', adminRouter);
router.use('/objectts', objecttRouter);


router.post('/upload', upload.single('file'), (req, res) => {
    let photoName : string;
    if (req.file) {
        photoName = req.file.filename;
        console.log(photoName, req.file.path);
    }
    else {
        photoName = "default"
    }

    res.json(photoName);
});


app.use('/', router);
app.listen(4000, () => console.log(`Express server running on port 4000`));