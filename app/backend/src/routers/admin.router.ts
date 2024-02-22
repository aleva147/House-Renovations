import express from 'express'
import { AdminController } from '../controllers/admin.controller';

const adminRouter = express.Router();


adminRouter.route('/addReqWorkers').post(
    (req, res) => new AdminController().addReqWorkers(req, res)
)

adminRouter.route('/getAllReqWorkers').post(
    (req, res) => new AdminController().getAllReqWorkers(req, res)
)

adminRouter.route('/getAllRegRequests').get(
    (req, res) => new AdminController().getAllRegRequests(req, res)
)

adminRouter.route('/changeRegRequestStatus').post(
    (req, res) => new AdminController().changeRegRequestStatus(req, res)
)

adminRouter.route('/removeReqWorkers').post(
    (req, res) => new AdminController().removeReqWorkers(req, res)
)

adminRouter.route('/getAllActiveJobs').get(
    (req, res) => new AdminController().getAllActiveJobs(req, res)
)

adminRouter.route('/getAllFinishedJobs').get(
    (req, res) => new AdminController().getAllFinishedJobs(req, res)
)

adminRouter.route('/declineTermination').post(
    (req, res) => new AdminController().declineTermination(req, res)
)

adminRouter.route('/acceptTermination').post(
    (req, res) => new AdminController().acceptTermination(req, res)
)

export default adminRouter;