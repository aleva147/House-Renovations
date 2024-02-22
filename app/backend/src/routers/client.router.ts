import express from 'express'
import { ClientController } from '../controllers/client.controller';

const clientRouter = express.Router();


clientRouter.route('/getClient').post(
    (req, res) => new ClientController().getClient(req, res)
)  

clientRouter.route('/getAll').get(
    (req, res) => new ClientController().getAll(req, res)
)   

clientRouter.route('/updateClient').post(
    (req, res) => new ClientController().updateClient(req, res)
)   

clientRouter.route('/remove').post(
    (req, res) => new ClientController().remove(req, res)
)   

clientRouter.route('/sendJobRequest').post(
    (req, res) => new ClientController().sendJobRequest(req, res)
)

clientRouter.route('/getRequests').post(
    (req, res) => new ClientController().getRequests(req, res)
)

clientRouter.route('/getActiveJobs').post(
    (req, res) => new ClientController().getActiveJobs(req, res)
)

clientRouter.route('/getFinishedJobs').post(
    (req, res) => new ClientController().getFinishedJobs(req, res)
)

clientRouter.route('/acceptRequest').post(
    (req, res) => new ClientController().acceptRequest(req, res)
)

clientRouter.route('/refuseRequest').post(
    (req, res) => new ClientController().refuseRequest(req, res)
)

clientRouter.route('/finishJob').post(
    (req, res) => new ClientController().finishJob(req, res)
)

clientRouter.route('/terminationReq').post(
    (req, res) => new ClientController().terminationReq(req, res)
)

clientRouter.route('/createComment').post(
    (req, res) => new ClientController().createComment(req, res)
)

clientRouter.route('/getComment').post(
    (req, res) => new ClientController().getComment(req, res)
)

clientRouter.route('/updateComment').post(
    (req, res) => new ClientController().updateComment(req, res)
)

clientRouter.route('/deleteComment').post(
    (req, res) => new ClientController().deleteComment(req, res)
)



export default clientRouter;