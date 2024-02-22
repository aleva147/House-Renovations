import express from 'express'
import { ObjecttController } from '../controllers/objectt.controller';

const objecttRouter = express.Router();


objecttRouter.route('/getAllForClient').post(
    (req, res) => new ObjecttController().getAllForClient(req, res)
)   

objecttRouter.route('/getById').post(
    (req, res) => new ObjecttController().getById(req, res)
) 

objecttRouter.route('/remove').post(
    (req, res) => new ObjecttController().remove(req, res)
) 

objecttRouter.route('/addObjectt').post(
    (req, res) => new ObjecttController().addObjectt(req, res)
) 

objecttRouter.route('/saveSketch').post(
    (req, res) => new ObjecttController().saveSketch(req, res)
) 

objecttRouter.route('/updateObjecttInfo').post(
    (req, res) => new ObjecttController().updateObjecttInfo(req, res)
) 

objecttRouter.route('/uploadObjectt').post(
    (req, res) => new ObjecttController().uploadObjectt(req, res)
) 



export default objecttRouter;