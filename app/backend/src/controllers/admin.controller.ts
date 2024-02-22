import express from 'express'
import ReqWorkersModel from '../models/reqWorkers'
import RegRequestModel from '../models/regRequest'
import JobModel from '../models/job'

export class AdminController {

    addReqWorkers = (req: express.Request, res: express.Response) => {
        // CORRECT.
        ReqWorkersModel.find({}).sort({'id':-1}).then(requests=>{
            let maxId = 0;
            if (requests.length > 0) maxId = requests[0].id;

            let id = maxId + 1;

            let request = new ReqWorkersModel({
                id : id,
                agency : req.body.agency,
                amount : req.body.amount
            })

            request.save((err, resp)=>{
                if (err) console.log(err)
                else res.json({'message':'success'})
            })
        })
        
        // INCORRECT. For example, say we have 3 entries in the database, we delete the first one, and then generate a new entry.
        //            The new entry will have the same id as the second one. 
        // ReqWorkersModel.count({}, (err, count)=>{
        //     if (err) console.log(err)
        //     else {
        //         let id = count + 1;

        //         let request = new ReqWorkersModel({
        //             id : id,
        //             agency : req.body.agency,
        //             amount : req.body.amount
        //         })

        //         request.save((err, resp)=>{
        //             if (err) console.log(err)
        //             else res.json({'message':'success'})
        //         })
        //     }
        // })
    }

    removeReqWorkers = (req: express.Request, res: express.Response) => {
        let id = req.body.id;

        ReqWorkersModel.findOneAndRemove({'id':id}, (err, resp)=>{
            if (err) console.log(err)
            else res.json({'message':'success'})
        })
    } 

    getAllReqWorkers = (req: express.Request, res: express.Response) => {
        let agency = req.body.agency;

        ReqWorkersModel.find({'agency':agency}, (err, reqs)=>{
            if (err) console.log(err)
            else res.json(reqs)
        })
    } 

    getAllRegRequests = (req: express.Request, res: express.Response) => {
        RegRequestModel.find({}, (err, regReqs)=>{
            if (err) console.log(err)
            else res.json(regReqs)
        })
    }

    changeRegRequestStatus = (req: express.Request, res: express.Response) => {
        let id = req.body.id;
        let status = req.body.status;

        RegRequestModel.findOneAndUpdate({'id':id}, {$set : {'status' : status}}, (err, resp)=>{
            if (err) console.log(err)
            else res.json({'message':'success'})
        })
    }    

    getAllActiveJobs = (req: express.Request, res: express.Response) => {
        JobModel.find({'type':'active'}, (err, jobs)=>{
            if (err) console.log(err)
            else res.json(jobs)
        })
    }

    getAllFinishedJobs = (req: express.Request, res: express.Response) => {
        JobModel.find({'type':'finished'}, (err, jobs)=>{
            if (err) console.log(err)
            else res.json(jobs)
        })
    }

    declineTermination = (req: express.Request, res: express.Response) => {
        let id = req.body.id;

        JobModel.findOneAndUpdate({'id':id}, {$set : {'status' : 'not seen', 'reason':null}}, (err, resp)=>{
            if (err) console.log(err)
            else res.json({'message':'success'})
        })
    }

    acceptTermination = (req: express.Request, res: express.Response) => {
        let id = req.body.id;

        JobModel.findOneAndUpdate({'id':id}, {$set : {'type' : 'finished', 'status' : 'terminated'}}, (err, resp)=>{
            if (err) console.log(err)
            else res.json({'message':'success'})
        })
    }
} 