import express from 'express'
import ObjecttModel from '../models/objectt'
import { Room } from '../models/room';

export class ObjecttController {

    getAllForClient = (req: express.Request, res: express.Response) => {
        let client = req.body.client;

        ObjecttModel.find({'client':client}, (err, objectts)=>{
            if (err) console.log(err)
            else res.json(objectts)
        })
    }

    getById = (req: express.Request, res: express.Response) => {
        let id = req.body.id;

        ObjecttModel.findOne({'id':id}, (err, objectt)=>{
            if (err) console.log(err)
            else res.json(objectt)
        })
    }

    remove = (req: express.Request, res: express.Response) => {
        let id = req.body.id;

        ObjecttModel.findOneAndRemove({'id':id}, (err,resp)=>{
            if (err) console.log(err)
            else res.json({'message':'success'})
        })
    }

    addObjectt = (req: express.Request, res: express.Response) => {
        ObjecttModel.find({}).sort({'id':-1}).then(objectts => {
            let maxId : number = 0;
            if (objectts.length > 0) maxId = objectts[0].id;

            let objectt = new ObjecttModel({
                id : (maxId+1),
                client : req.body.client,
                type : req.body.type, 
                address : req.body.address,
                numOfRooms : req.body.numOfRooms,
                sqFootage : req.body.sqFootage,
                sketch : req.body.rooms,
            })

            objectt.save((err, resp)=>{
                if (err) console.log(err)
                else res.json((maxId+1))
            })
        })
    }

    saveSketch = (req: express.Request, res: express.Response) => {
        let id = req.body.id;
        let rooms : Room[] = req.body.rooms;

        ObjecttModel.findOneAndUpdate({'id':id}, {$set : {'sketch' : rooms}}, (err,resp)=>{
            if (err) console.log(err)
            else res.json({'message':'success'})
        })
    }

    updateObjecttInfo = (req: express.Request, res: express.Response) => {
        let id = req.body.id;
        let type = req.body.type;
        let address = req.body.address;
        let numOfRooms = req.body.numOfRooms;
        let sqFootage = req.body.sqFootage;

        ObjecttModel.findOneAndUpdate({'id':id}, {$set : {'type' : type, 'address':address, 'numOfRooms':numOfRooms, 'sqFootage':sqFootage}}, (err,resp)=>{
            if (err) console.log(err)
            else res.json({'message':'success'})
        })
    }

    uploadObjectt = (req: express.Request, res: express.Response) => {
        let jsonObject = req.body.jsonObject;

        ObjecttModel.find({}).sort({'id':-1}).then(objectts => {
            let maxId : number = 0;
            if (objectts.length > 0) maxId = objectts[0].id;

            let newObjectt = new ObjecttModel({
                id : (maxId+1),
                client : jsonObject['client'],
                type : jsonObject['type'],
                address : jsonObject['address'],
                numOfRooms : jsonObject['numOfRooms'],
                sqFootage : jsonObject['sqFootage'],
                sketch : jsonObject['sketch']
            })
    
            newObjectt.save((err,resp)=>{
                if (err) console.log(err)
                else res.json({'message':'success'})
            })
        })
    }
}