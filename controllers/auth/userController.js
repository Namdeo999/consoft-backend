import { ObjectId } from "mongodb";
import { User, ProjectTeam } from "../../models/index.js";
import { userSchema } from "../../validators/index.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import bcrypt from 'bcrypt';
import JwtService from '../../services/JwtService.js'
import CustomFunction from "../../services/CustomFunction.js";

import transporter from "../../config/emailConfig.js";
import { EMAIL_FROM } from "../../config/index.js";

// import jwt from 'jsonwebtoken';

const userController ={
    // async me(req, res, next){
    //     //logic here
    //     try {
    //         const user = await User.findOne({_id: req.user._id}).select('-password -createdAt -updatedAt  -__v');
    //         if(!user){
    //             return next(CustomErrorHandler.notFound());
    //         }
    //         res.json(user);
    //     } catch (err) {
    //         return next(err);
    //     }
    // }

    async register(req, res, next){
        const {error} = userSchema.validate(req.body);
        if (error) {
            return next(error);
        }
        
        try {
            const exist = await User.exists({mobile:req.body.mobile});
            if (exist) {
                return next(CustomErrorHandler.alreadyExist('This mobile is already taken.'));
            }

        } catch (err) {
            return next(err);
        }

        const password = CustomFunction.stringPassword(6);

        const { name, email, mobile, role_id, company_id, project_id } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = new User({
            name,
            email,
            mobile,
            role_id,
            password: hashedPassword,
            company_id,
        });
        // let access_token;
        // let refresh_token;
        try {
            const result = await user.save();  
            if(result) {


                const projectTeam = new ProjectTeam({
                    project_id:project_id,
                    user_id:result._id,
                });

                const data = await projectTeam.save();

                let info = transporter.sendMail({
                    from: EMAIL_FROM, // sender address
                    to: email, // list of receivers
                    subject: "Login Password ", // Subject line
                    text: " Password  " + password, // plain text body
                });
            } 
            // Token
            // access_token = JwtService.sign({ _id: result._id }); //used
            // access_token = JwtService.sign({ _id: result._id, role_id: result.role_id }); //used

            // refresh_token = JwtService.sign({ _id: result._id, role: result.role }, '1y', REFRESH_SECRET);
            // // database whitelist
            // await RefreshToken.create({ token: refresh_token });
        } catch(err) {
            return next(err);
        }
        // res.json({status:200, access_token:access_token });
        res.json({status:200 });
    },
    
    async user(req, res, next){
        let user;
        try {
            // const user = await User.findOne({_id: req.user._id}).select('-password -createdAt -updatedAt  -__v');
            await User.aggregate([
                {
                    $match: {
                        "_id": ObjectId(req.user._id)
                    }
                },
                {
                    $lookup: {
                        from: "userRoles",
                        localField: "role_id",
                        foreignField: "_id",
                        as: 'data'
                    }
                },
                {$unwind:"$data"}, 
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        email:1,
                        mobile:1,
                        role_id:1,
                        role:"$data.user_role",
                    }
                } 

            ]).then(function ([res]) {
                user = res;
            })
            
            if(!user){
                return next(CustomErrorHandler.notFound());
            }
            res.json(user);
        } catch (err) {
            return next(err);
        }
    },

    async index(req, res, next){
        let users;
        try {
            // users = await User.find().select('-password -createdAt -updatedAt -__v');

            users = await User.aggregate([
                {
                    $lookup: {
                        from: "userRoles",
                        localField: 'role_id',
                        foreignField: "_id",
                        as: 'data'
                    }
                },
                {
                    $unwind: "$data"
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        email: 1,
                        mobile: 1,
                        user_role: "$data.user_role"
                    }
                }
            ])

        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json(users);
    },

    async roleByUsers(req, res, next){
        let documents;
        try {
            documents = await User.find({ role_id:req.params.role_id }).select('-createdAt -updatedAt -__v');
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }

        return res.json({status:200, data:documents});
    },

}

export default userController;