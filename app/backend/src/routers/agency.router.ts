import express from 'express'
import { AgencyController } from '../controllers/agency.controller';

const agencyRouter = express.Router();


agencyRouter.route('/getAll').get(
    (req, res) => new AgencyController().getAll(req, res)
)   

agencyRouter.route('/getAgency').post(
    (req, res) => new AgencyController().getAgency(req, res)
)

agencyRouter.route('/updateAgency').post(
    (req, res) => new AgencyController().updateAgency(req, res)
)   

agencyRouter.route('/getAllWorkers').post(
    (req, res) => new AgencyController().getAllWorkers(req, res)
)   

agencyRouter.route('/removeWorker').post(
    (req, res) => new AgencyController().removeWorker(req, res)
)   

agencyRouter.route('/updateWorker').post(
    (req, res) => new AgencyController().updateWorker(req, res)
) 

agencyRouter.route('/addWorker').post(
    (req, res) => new AgencyController().addWorker(req, res)
) 

agencyRouter.route('/getComments').post(
    (req, res) => new AgencyController().getComments(req, res)
) 

agencyRouter.route('/remove').post(
    (req, res) => new AgencyController().remove(req, res)
)   

agencyRouter.route('/changeOpenPositions').post(
    (req, res) => new AgencyController().changeOpenPositions(req, res)
)   

agencyRouter.route('/getNewRequests').post(
    (req, res) => new AgencyController().getNewRequests(req, res)
)   

agencyRouter.route('/acceptRequest').post(
    (req, res) => new AgencyController().acceptRequest(req, res)
)   

agencyRouter.route('/refuseRequest').post(
    (req, res) => new AgencyController().refuseRequest(req, res)
)   

agencyRouter.route('/getActiveJobs').post(
    (req, res) => new AgencyController().getActiveJobs(req, res)
)   

agencyRouter.route('/getAvailableWorkers').post(
    (req, res) => new AgencyController().getAvailableWorkers(req, res)
)   

agencyRouter.route('/getAssignedWorkers').post(
    (req, res) => new AgencyController().getAssignedWorkers(req, res)
)   

agencyRouter.route('/getWorker').post(
    (req, res) => new AgencyController().getWorker(req, res)
)  

agencyRouter.route('/assignWorker').post(
    (req, res) => new AgencyController().assignWorker(req, res)
)  

agencyRouter.route('/updateJobSketch').post(
    (req, res) => new AgencyController().updateJobSketch(req, res)
)  

agencyRouter.route('/freeWorker').post(
    (req, res) => new AgencyController().freeWorker(req, res)
)  

export default agencyRouter;