import express from 'express'
import AgencyModel from '../models/agency'
import UserModel from '../models/user'
import WorkerModel from '../models/worker'
import CommentModel from '../models/comment'
import JobModel from '../models/job'

export class AgencyController {
    getAll = (req: express.Request, res: express.Response) => {
        AgencyModel.find({}, (err, agencies)=>{
            if (err) console.log(err)
            else {
                res.json(agencies)
            }
        })
    }

    getAgency = (req: express.Request, res: express.Response) => {
        let username = req.body.username;

        AgencyModel.findOne({'username':username}, (err, agency)=>{
            if (err) console.log(err)
            else {
                res.json(agency)
            }
        })
    }

    updateAgency = (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        let name = req.body.name;
        let country = req.body.country;
        let city = req.body.city;
        let street = req.body.street;
        let description = req.body.description;

        let mail = req.body.mail;
        let phone = req.body.phone;
        let photoname = req.body.photoname;

        AgencyModel.updateOne({'username':username}, {$set : {'name':name, 'country':country, 'city':city, 
        'street':street, 'description':description}}, (err,resp)=>{

            if (err) console.log(err)
            else {
                UserModel.updateOne({'username':username}, {$set : {'phone':phone, 'mail':mail, 'photoname':photoname}}, (err,resp)=>{
                    if (err) console.log(err)
                    else res.json({'message':'success'})
                })
            }
        })
    }

    getAllWorkers = (req: express.Request, res: express.Response) => {
        let agency = req.body.agency;

        WorkerModel.find({'agency':agency}, (err, workers)=>{
            if (err) console.log(err)
            else {
                res.json(workers)
            }
        })
    }

    removeWorker = (req: express.Request, res: express.Response) => {
        let agency = req.body.agency;
        let id = req.body.id;

        WorkerModel.findOneAndRemove({'agency':agency, 'id':id}, (err, resp)=>{
            if (err) console.log(err)
            else {
                // Increment Open Positions:
                AgencyModel.findOneAndUpdate({'username':agency}, {$inc : {'openPositions' : 1}}, (err, resp)=>{
                    if (err) console.log(err)
                    else res.json({'message':'success'})
                })
            }
        })
    }

    updateWorker = (req: express.Request, res: express.Response) => {
        let agency = req.body.agency;
        let id = req.body.id;
        let firstname = req.body.firstname;
        let lastname = req.body.lastname;
        let phone = req.body.phone;
        let mail = req.body.mail;
        let field = req.body.field;

        WorkerModel.findOneAndUpdate({'agency':agency, 'id':id}, {$set : {'firstname':firstname, 'lastname':lastname,
        'phone':phone, 'mail':mail, 'field':field}}, (err, resp)=>{
            if (err) console.log(err)
            else {
                res.json({'message':'success'})
            }
        })
    }

    addWorker = (req: express.Request, res: express.Response) => {
        WorkerModel.find({}).sort({'id':-1}).then(workers=>{
            let maxId = 0;
            if (workers.length > 0) maxId = workers[0].id;

            let id = maxId + 1;
            let agency = req.body.agency;

            let worker = new WorkerModel({
                id : id,
                agency : agency,
                firstname : req.body.firstname,
                lastname : req.body.lastname,
                phone : req.body.phone,
                mail : req.body.mail,
                field : req.body.field,
                job : null
            })

            worker.save((err, resp)=>{
                if (err) console.log(err)
                else {
                    // Decrement Open Positions
                    AgencyModel.findOneAndUpdate({'username':agency}, {$inc : {'openPositions' : -1}}, (err, resp)=>{
                        if (err) console.log(err)
                        else res.json({'message':'success'})
                    })
                } 
            })
        })
    }

    getComments = (req: express.Request, res: express.Response) => {
        let agency = req.body.agency;

        CommentModel.find({'agency':agency}, (err, comments)=>{
            if (err) console.log(err)
            else res.json(comments)
        })
    }
    
    remove = (req: express.Request, res: express.Response) => {
        let username = req.body.username;

        AgencyModel.findOneAndRemove({'username':username}, (err,resp)=>{
            if (err) console.log(err)
            else {
                UserModel.findOneAndRemove({'username':username}, (err,resp)=>{
                    if (err) console.log(err)
                    else res.json({'message':'success'})
                })
            }
        })
    }

    changeOpenPositions = (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        let amount = req.body.amount;

        AgencyModel.findOneAndUpdate({'username':username}, {$set : {'openPositions':amount}}, (err,resp)=>{
            if (err) console.log(err)
            else res.json({'message':'success'})
        })
    }

    getNewRequests = (req: express.Request, res: express.Response) => {
        let agency = req.body.agency;

        JobModel.find({'agency':agency, 'type':'request', 'status':'not seen'}, (err, requests)=>{
            if (err) console.log(err)
            else res.json(requests)
        })
    }

    acceptRequest = (req: express.Request, res: express.Response) => {
        let id = req.body.id;
        let cost = req.body.cost;

        JobModel.findOneAndUpdate({'id':id}, {$set : {'status':'accepted', 'cost':cost}}, (err,resp)=>{
            if (err) console.log(err)
            else res.json({'message':'success'})
        })
    }
    
    refuseRequest = (req: express.Request, res: express.Response) => {
        let id = req.body.id;

        JobModel.findOneAndUpdate({'id':id}, {$set : {'status':'refused'}}, (err,resp)=>{
            if (err) console.log(err)
            else res.json({'message':'success'})
        })
    }

    getActiveJobs = (req: express.Request, res: express.Response) => {
        let agency = req.body.agency;

        JobModel.find({'agency':agency, 'type':'active'}, (err, requests)=>{
            if (err) console.log(err)
            else res.json(requests)
        })
    }

    getAvailableWorkers = (req: express.Request, res: express.Response) => {
        let agency = req.body.agency;

        WorkerModel.find({'agency':agency, 'job':null}, (err, workers)=>{
            if (err) console.log(err)
            else {
                res.json(workers)
            }
        })
    }

    getAssignedWorkers = (req: express.Request, res: express.Response) => {
        let agency = req.body.agency;
        let job = req.body.job;

        WorkerModel.find({'agency':agency, 'job':job}, (err, workers)=>{
            if (err) console.log(err)
            else {
                res.json(workers)
            }
        })
    }

    getWorker = (req: express.Request, res: express.Response) => {
        let id = req.body.id;

        WorkerModel.findOne({'id':id}, (err, worker)=>{
            if (err) console.log(err)
            else res.json(worker)
        })
    }

    assignWorker = (req: express.Request, res: express.Response) => {
        let workerId = req.body.workerId;
        let jobId = req.body.jobId;
        let sketch = req.body.sketch;

        WorkerModel.findOneAndUpdate({'id':workerId}, {$set : {'job':jobId}}, (err, resp)=>{
            if (err) console.log(err)
            else {
                JobModel.findOneAndUpdate({'id':jobId}, {$set : {'sketch':sketch}}, (err, resp)=>{
                    if (err) console.log(err)
                    else res.json({'message':'success'});
                })
            }
        })
    }

    updateJobSketch = (req: express.Request, res: express.Response) => {
        let jobId = req.body.jobId;
        let sketch = req.body.sketch;

        JobModel.findOneAndUpdate({'id':jobId}, {$set : {'sketch':sketch}}, (err, resp)=>{
            if (err) console.log(err)
            else res.json({'message':'success'});
        })
    }

    freeWorker = (req: express.Request, res: express.Response) => {
        let id = req.body.workerId;

        WorkerModel.findOneAndUpdate({'id':id}, {$set : {'job':null}}, (err, resp)=>{
            if (err) console.log(err)
            else res.json({'message':'success'});
        })
    }
}