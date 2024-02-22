import express from 'express'
import { UserController } from '../controllers/user.controller';

const userRouter = express.Router();


userRouter.route('/login').post(
    (req, res) => new UserController().login(req, res)
)   

userRouter.route('/sendEmail').post(
    (req, res) => new UserController().sendEmail(req, res)
)   

userRouter.route('/findUser').post(
    (req, res) => new UserController().findUser(req, res)
) 

userRouter.route('/findUserInclRegReqs').post(
    (req, res) => new UserController().findUserInclRegReqs(req, res)
)

userRouter.route('/findUserWithMail').post(
    (req, res) => new UserController().findUserWithMail(req, res)
)   

userRouter.route('/findUserWithMailInclRegReqs').post(
    (req, res) => new UserController().findUserWithMailInclRegReqs(req, res)
)   

userRouter.route('/sendRegRequest').post(
    (req, res) => new UserController().sendRegRequest(req, res)
)   

userRouter.route('/getProfilePhoto').post(
    (req, res) => new UserController().getProfilePhoto(req, res)
)   

userRouter.route('/getProfilePhotoWithPhotoname').post(
    (req, res) => new UserController().getProfilePhotoWithPhotoname(req, res)
)   

userRouter.route('/changePassword').post(
    (req, res) => new UserController().changePassword(req, res)
)   

userRouter.route('/addAgency').post(
    (req, res) => new UserController().addAgency(req, res)
)   

userRouter.route('/addClient').post(
    (req, res) => new UserController().addClient(req, res)
)   


export default userRouter;