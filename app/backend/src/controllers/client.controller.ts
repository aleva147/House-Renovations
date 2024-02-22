import express from 'express'
import ClientModel from '../models/client'
import UserModel from '../models/user'
import JobModel from '../models/job'
import CommentModel from '../models/comment'

export class ClientController {
    getClient = (req: express.Request, res: express.Response) => {
        let username = req.body.username;

        ClientModel.findOne({'username':username}, (err, client)=>{
            if (err) console.log(err)
            else {
                res.json(client)
            }
        })
    }

    getAll = (req: express.Request, res: express.Response) => {
        ClientModel.find({}, (err, clients)=>{
            if (err) console.log(err)
            else res.json(clients)
        })
    }

    updateClient = (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        let firstname = req.body.firstname;
        let lastname = req.body.lastname;
        let phone = req.body.phone;
        let mail = req.body.mail;
        let photoname = req.body.photoname;

        ClientModel.updateOne({'username':username}, {$set : {'firstname':firstname, 'lastname':lastname}}, (err, resp)=>{
            if (err) console.log(err)
            else {
                UserModel.updateOne({'username':username}, {$set : {'phone':phone, 'mail':mail, 'photoname':photoname}}, (err, resp)=>{
                    if (err) console.log(err)
                    else res.json({'message':'success'})
                })
            }
        })
    }

    remove = (req: express.Request, res: express.Response) => {
        let username = req.body.username;

        ClientModel.findOneAndRemove({'username':username}, (err,resp)=>{
            if (err) console.log(err)
            else {
                UserModel.findOneAndRemove({'username':username}, (err,resp)=>{
                    if (err) console.log(err)
                    else res.json({'message':'success'})
                })
            }
        })
    }

    sendJobRequest = (req: express.Request, res: express.Response) => {
        JobModel.find({}).sort({'id':-1}).then(jobs => {
            let maxId : number = 0;
            if (jobs.length > 0) maxId = jobs[0].id;

            let job = new JobModel({
                id : (maxId+1),
                client : req.body.client,
                object : req.body.object,
                agency : req.body.agency,
                type : 'request',
                status : 'not seen',
                starting : req.body.starting,
                deadline : req.body.deadline,
                cost : null,
                comment : null,
                reason : null,
                sketch : req.body.sketch
            })

            job.save((err, resp)=>{
                if (err) console.log(err)
                else res.json({'message':'success'})
            })
        })
    }

    getRequests = (req: express.Request, res: express.Response) => {
        let client = req.body.client;

        JobModel.find({'client':client, 'type':'request'}, (err,jobs)=>{
            if (err) console.log(err)
            else res.json(jobs)
        })
    }

    getActiveJobs = (req: express.Request, res: express.Response) => {
        let client = req.body.client;

        JobModel.find({'client':client, 'type':'active'}, (err,jobs)=>{
            if (err) console.log(err)
            else res.json(jobs)
        })
    }

    getFinishedJobs = (req: express.Request, res: express.Response) => {
        let client = req.body.client;

        JobModel.find({'client':client, 'type':'finished'}, (err,jobs)=>{
            if (err) console.log(err)
            else res.json(jobs)
        })
    }

    acceptRequest = (req: express.Request, res: express.Response) => {
        let id = req.body.id;

        JobModel.findOneAndUpdate({'id':id}, {$set : {'type':'active'}}, (err,resp)=>{
            if (err) console.log(err)
            else res.json({'message':'success'})
        })
    } 

    refuseRequest = (req: express.Request, res: express.Response) => {
        let id = req.body.id;

        JobModel.findOneAndRemove({'id':id}, (err,resp)=>{
            if (err) console.log(err)
            else res.json({'message':'success'})
        })
    }

    finishJob = (req: express.Request, res: express.Response) => {
        let id = req.body.id;

        JobModel.findOneAndUpdate({'id':id}, {$set : {'type':'finished', 'status':'regularly'}}, (err,resp)=>{
            if (err) console.log(err)
            else res.json({'message':'success'})
        })
    }

    terminationReq = (req: express.Request, res: express.Response) => {
        let id = req.body.id;
        let reason = req.body.reason;

        JobModel.findOneAndUpdate({'id':id}, {$set : {'status':'termination', 'reason':reason}}, (err,resp)=>{
            if (err) console.log(err)
            else res.json({'message':'success'})
        })
    }

    createComment = (req: express.Request, res: express.Response) => {
        CommentModel.find({}).sort({'id':-1}).then(comments=>{
            let maxId = 0;
            if (comments.length > 0) maxId = comments[0].id;
            
            let comment = new CommentModel({
                id : (maxId+1),
                username : req.body.username,
                agency : req.body.agency,
                text : req.body.text,
                grade : req.body.grade
            })

            comment.save((err, resp)=>{
                if (err) console.log(err)
                else {
                    let jobId = req.body.jobId;

                    JobModel.findOneAndUpdate({'id':jobId}, {$set : {'comment':(maxId+1)}}, (err,resp)=>{
                        if (err) console.log(err)
                        else res.json((maxId+1))
                    })
                }
            })

        })
    }

    getComment = (req: express.Request, res: express.Response) => {
        let id = req.body.id;

        CommentModel.findOne({'id':id}, (err,comment)=>{
            if (err) console.log(err)
            else res.json(comment)
        })
    }

    updateComment = (req: express.Request, res: express.Response) => {
        let id = req.body.id;
        let text = req.body.text;
        let grade = req.body.grade;

        CommentModel.findOneAndUpdate({'id':id}, {$set : {'text':text, 'grade':grade}}, (err,resp)=>{
            if (err) console.log(err)
            else res.json({'message':'success'})
        })
    }

    deleteComment = (req: express.Request, res: express.Response) => {
        let id = req.body.id;
        let jobId = req.body.jobId;

        CommentModel.findOneAndRemove({'id':id}, (err,resp)=>{
            if (err) console.log(err)
            else {
                JobModel.findOneAndUpdate({'id':jobId}, {$set : {'comment':null}}, (err, resp)=>{
                    if (err) console.log(err)
                    res.json({'message':'success'});
                })
            }
        })
    }
}