import express from 'express'
import UserModel from '../models/user'
import AgencyModel from '../models/agency'
import ClientModel from '../models/client'
import RegRequestModel from '../models/regRequest'
import imageToBase64 from 'image-to-base64'

export class UserController {
    login = (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        let password = req.body.password;

        UserModel.findOne({'username':username, 'password':password}, (err, user) => {
            if (err) console.log(err)
            else {
                if (!user) {
                    UserModel.findOne({'username':username, 'temppass':password}, (err, user) => {
                        if (err) console.log(err)
                        else {
                            if (user) {
                                console.log(new Date().toTimeString());
                                console.log(user.validuntil.toTimeString());

                                if (new Date() < user.validuntil) {
                                    console.log('Less than 10 mins passed');
                                    res.json({'user':user, 'message':'success'});
                                }
                                else {
                                    console.log('More than 10 mins passed');
                                    res.json({'user':null, 'message':'toolate'});
                                }
                            }
                            else {
                                res.json({'user':null, 'message':'notfound'});
                            }
                        }
                    })
                }
                else {
                    if (user.temppass != null) {
                        res.json({'user':null, 'message':'oldpassword'});
                    }
                    else {
                        res.json({'user':user, 'message':'success'});
                    }
                }
            }
        })
    }

    // 1) npm install nodemailer.
    // 2) Create a Google Account and set it up to support nodemailer (read "nodemailerSetup.txt").
    sendEmail = (req: express.Request, res: express.Response) => {
        let addressTo = req.body.addressTo;
        let reason = req.body.reason;

        let subject : string;
        let text : string;
        let newPass : string;
        let validuntil : Date = new Date();

        if (reason == "forgot password") {
            newPass = this.generatePassword();
            validuntil.setMinutes(validuntil.getMinutes() + 10);

            subject = 'Forgot Password';
            text = `Here is a temporary password that is valid for the next 10 minutes:   ${newPass} \n
            Use it to access your account and make a new password for the future.`
        }

        this.email(addressTo, subject, text);

        if (reason == "forgot password") {
            UserModel.updateOne({'mail':addressTo}, {$set: {'temppass':newPass, 'validuntil':validuntil}}, (err, user) => {
                if (err) console.log(err)
                else res.json({'message':'success'})
            })
        }
    }

    findUser = (req: express.Request, res: express.Response) => {
        let username = req.body.username;

        UserModel.findOne({'username':username}, (err,user)=>{
            if (err) console.log(err)
            else res.json(user)
        })
    }

    findUserInclRegReqs = (req: express.Request, res: express.Response) => {
        let username = req.body.username;

        UserModel.findOne({'username':username}, (err,user)=>{
            if (err) console.log(err)
            else {
                if (!user) {
                    RegRequestModel.findOne({'username':username, 'status':'rejected'}, (err,user)=>{
                        if (err) console.log(err)
                        else res.json(user)
                    })
                }
                else res.json(user)
            }
        })
    }

    findUserWithMail = (req: express.Request, res: express.Response) => {
        let mail = req.body.mail;

        UserModel.findOne({'mail':mail}, (err,user)=>{
            if (err) console.log(err)
            else res.json(user)
        })
    }

    findUserWithMailInclRegReqs = (req: express.Request, res: express.Response) => {
        let mail = req.body.mail;

        UserModel.findOne({'mail':mail}, (err,user)=>{
            if (err) console.log(err)
            else {
                if (!user) {
                    RegRequestModel.findOne({'mail':mail, 'status':'rejected'}, (err,user)=>{
                        if (err) console.log(err)
                        else res.json(user)
                    })
                }
                else res.json(user)
            }
        })
    }

    sendRegRequest = (req: express.Request, res: express.Response) => {
        let regReq = new RegRequestModel({
            username: req.body.username, password: req.body.password, phone: req.body.phone, mail: req.body.mail, type: req.body.type,
            photoname: req.body.photoname, firstname: req.body.firstname, lastname: req.body.lastname, name: req.body.name,
            country: req.body.country, city: req.body.city, street: req.body.street,
            identification: req.body.identification, description: req.body.description, status: 'pending'
        }) 

        regReq.save((err, resp)=>{
            if (err) console.log(err)
            else res.json({"message":"success"})
        })
    }

    getProfilePhoto = (req: express.Request, res: express.Response) => {
        let username = req.body.username;

        UserModel.findOne({'username':username}, (err,user)=>{
            if (err) console.log(err)
            else {
                
                let path = "uploads\\";
                if (user.photoname == "default") {
                    if (user.type == "client") path += "defaultPhoto.png";
                    else path += "defaultLogo.jpg";
                }
                else {
                    path += user.photoname;
                }

                imageToBase64(path)
                .then(
                    (response)=>{
                        let base64 : string = response;
                        res.json({'base64':base64});
                    }
                )
                .catch(
                    (error)=>{
                        console.log(error)
                    }
                )
            }
        })
    }

    getProfilePhotoWithPhotoname = (req: express.Request, res: express.Response) => {
        let photoname = req.body.photoname;
        let type = req.body.type;

        let path = "uploads\\";

        if (photoname == "default") {
            if (type == "client") path += "defaultPhoto.png";
            else path += "defaultLogo.jpg";
        }
        else {
            path += photoname;
        }

        imageToBase64(path)
        .then(
            (response)=>{
                let base64 : string = response;
                res.json({'base64':base64});
            }
        )
        .catch(
            (error)=>{
                console.log(error)
            }
        )
    }

    changePassword = (req: express.Request, res: express.Response) => {
        let username = req.body.username;
        let password = req.body.password;

        UserModel.updateOne({'username':username}, {$set : {'password':password, 'temppass':null, 'validuntil':null}}, (err,resp)=>{
            if (err) console.log(err)
            else res.json({'message':'success'})
        })
    }

    addAgency = (req: express.Request, res: express.Response) => {
        let user = new UserModel({
            username: req.body.username, password: req.body.password, phone: req.body.phone, mail: req.body.mail, type: 'agency',
            photoname: req.body.photoname, temppass: null, validuntil: null
        }) 

        user.save((err, resp)=>{
            if (err) console.log(err)
            else {
                let agency = new AgencyModel({
                    username : req.body.username, name: req.body.name, country: req.body.country, city: req.body.city, street: req.body.street,
                    identification : req.body.identification, description : req.body.description, openPositions : 0
                })

                agency.save((err, resp)=>{
                    if (err) console.log(err)
                    else res.json({"message":"success"})
                })
            }
        })
    }
    
    addClient = (req: express.Request, res: express.Response) => {
        let user = new UserModel({
            username: req.body.username, password: req.body.password, phone: req.body.phone, mail: req.body.mail, type: 'client',
            photoname: req.body.photoname, temppass: null, validuntil: null
        }) 

        user.save((err, resp)=>{
            if (err) console.log(err)
            else {
                let client = new ClientModel({
                    username : req.body.username, 
                    firstname: req.body.firstname, 
                    lastname: req.body.lastname
                })

                client.save((err, resp)=>{
                    if (err) console.log(err)
                    else res.json({"message":"success"})
                })
            }
        })
    }




    ///
    /// Helper functions:
    ///
    generatePassword() {
        let length = 12;
        let charsSetAll = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&+=';
        let charUpperL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        let charLowerL = 'abcdefghijklmnopqrstuvwxyz'
        let charNums = '0123456789'
        let charSpec = '@#$%^&+='

        let newPassword = '';
        for (let i = 0; i < length; i++) {
            newPassword += charsSetAll.charAt(Math.floor(Math.random() * charsSetAll.length));
        }


        // Password is generated, but now we need to make sure that at least 
        // one uppercase letter, one lowercase letter, one number, and one special character 
        // were used in random positions.
        let randUppId : number;
        let randLowId : number;
        let randNumId : number;
        let randSpeId : number;

        randUppId = 0;
        do {
            randLowId = Math.floor(Math.random() * length);
        } while (randLowId == randUppId)
        do {
            randNumId = Math.floor(Math.random() * length);
        } while (randNumId == randUppId || randNumId == randLowId)
        do {
            randSpeId = Math.floor(Math.random() * length);
        } while (randSpeId == randUppId || randSpeId == randLowId || randSpeId == randNumId)

        newPassword = this.replaceAt(newPassword, randUppId, charUpperL.charAt(Math.floor(Math.random() * charUpperL.length)));
        newPassword = this.replaceAt(newPassword, randLowId, charLowerL.charAt(Math.floor(Math.random() * charLowerL.length)));
        newPassword = this.replaceAt(newPassword, randNumId, charNums.charAt(Math.floor(Math.random() * charNums.length)));
        newPassword = this.replaceAt(newPassword, randSpeId, charSpec.charAt(Math.floor(Math.random() * charSpec.length)));
        
        return newPassword;
    }
    

    email(addressTo, subject, text) {
        var nodemailer = require('nodemailer');

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'premimptemp@gmail.com',
                pass: 'cjnyohilokwtknsk'
            }
        });
        
        var mailOptions = {
            from: 'premimptemp@gmail.com',
            to: addressTo,
            subject: subject,
            text: text
        };
        
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }


    replaceAt(str, ind, char) {
        return str.substring(0, ind) + char + str.substring(ind + 1);
    }
}