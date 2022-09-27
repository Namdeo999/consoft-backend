import { ObjectId } from "mongodb";
import { User, ProjectTeam, UserPrivilege } from "../../models/index.js";
import { userSchema } from "../../validators/index.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";
import bcrypt from 'bcrypt';
import JwtService from '../../services/JwtService.js'
import CustomFunction from "../../services/CustomFunction.js";
import Constants from "../../constants/index.js";

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

    async userRegister(req, res, next){
        const {error} = userSchema.validate(req.body);
        if (error) {
            return next(error);
        }
        const { name, email, mobile, role_id, user_privilege, company_id, assign_project, project_id } = req.body;
        const other_team_id = Constants.PRIVILEGE_OTHER_TEAM; //ObjectId
        try {
            if (other_team_id != user_privilege) {
                const privilege_exist = await User.exists({company_id:ObjectId(company_id), user_privilege:ObjectId(user_privilege)});
                if (privilege_exist) {
                    return next(CustomErrorHandler.alreadyExist('!Sorry this admin is already created. multiple not allowed ( admin-1, admin-2, admin-3 ) only create once. if you want to create multiple then select OTHER TEAM option.'));
                }
            }
        } catch (err) {
            return next(err);
        }
        
        let unique_id ; //unique, user_id
        try {
            const mobile_exist = await User.exists({company_id:ObjectId(company_id), mobile:mobile});
            if (mobile_exist) {
                return next(CustomErrorHandler.alreadyExist('This mobile is already taken.'));
            }

            const email_exist = await User.exists({company_id:ObjectId(company_id), email:email}).collation({locale:'en', strength:1});
            if (email_exist) {
                return next(CustomErrorHandler.alreadyExist('This email is already taken.'));
            }
            
            unique_id = await generateRandomUserId();

        } catch (err) {
            return next(err);
        }

        const password = CustomFunction.stringPassword(6);
        // const { name, email, mobile, role_id, user_privilege, company_id, assign_project, project_id } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // let access_token;
        // let refresh_token;
        try {
            const user = new User({
                u_id:unique_id,
                name,
                email,
                mobile,
                role_id,
                user_privilege,
                password: hashedPassword,
                company_id,
            });
            const result = await user.save();
            
            //assign to project
            if(assign_project === true){
                if (result) {
                    const exist = await ProjectTeam.exists({ company_id:ObjectId(company_id), project_id: ObjectId(project_id), user_id:ObjectId(result._id)});
                    if (exist) {
                        return next(CustomErrorHandler.alreadyExist('User is already assined on this project'));
                    }
                    const project_team = new ProjectTeam({
                        company_id,
                        project_id,
                        user_id:result._id
                    });
                    await project_team.save();
                }
            }
             
            let info = transporter.sendMail({
                from: EMAIL_FROM, // sender address
                to: email, // list of receivers
                subject: "Product key & login password ", // Subject line
                text: " Password  " + password, // plain text body
            });
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
        return res.json({status:200 });
    },

    async update(req, res, next){
        const {error} = userSchema.validate(req.body);
        if (error) {
            return next(error);
        }

        const { name, email, mobile, role_id, user_privilege, company_id, assign_project, project_id } = req.body;
        const other_team_id = Constants.PRIVILEGE_OTHER_TEAM; //ObjectId
        try {
            if (other_team_id != user_privilege) {
                const privilege_exist = await User.exists({company_id:ObjectId(company_id), user_privilege:ObjectId(user_privilege)});
                if (privilege_exist) {
                    return next(CustomErrorHandler.alreadyExist('!Sorry this admin is already created. multiple not allowed ( admin-1, admin-2, admin-3 ) only create once. if you want to create multiple then select OTHER TEAM option.'));
                }
            }
        } catch (err) {
            return next(err);
        }
        try {
            const mobile_exist = await User.exists({ _id : { $ne : req.params.id}, company_id:ObjectId(company_id), mobile:mobile});
            if (mobile_exist) {
                return next(CustomErrorHandler.alreadyExist('This mobile is already taken.'));
            }
            const email_exist = await User.exists({_id : { $ne : req.params.id}, company_id:ObjectId(company_id), email:email}).collation({locale:'en', strength:1});
            if (email_exist) {
                return next(CustomErrorHandler.alreadyExist('This email is already taken.'));
            }
        } catch (err) {
            return next(err);
        }

        try {
            const filter = { _id: req.params.id };
            const updateDocument = {
                $set: {
                    name,
                    email,
                    mobile,
                    role_id,
                    user_privilege,
                },
            };
            const options = { upsert: true };
            const result = await User.findOneAndUpdate(filter, updateDocument, options);
        } catch (err) {
            return next(err);
        }
        return res.send(CustomSuccessHandler.success("User detail updated successfully"))
    },
    
    async user(req, res, next){
        let user;
        try {
            // const user = await User.findOne({_id: req.user._id}).select('-password -createdAt -updatedAt  -__v');
            await User.aggregate([
                {
                    $match: {
                        // "_id": ObjectId(req.user.id)
                        "_id": ObjectId(req.params.user_id)
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
                        user_privilege: 1,
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
            users = await User.aggregate([
                {
                    $match: {
                        "company_id":ObjectId(req.params.company_id)
                    }
                },
                {
                    $lookup: {
                        from: "userRoles",
                        localField: 'role_id',
                        foreignField: "_id",
                        as: 'userRoleData'
                    }
                },
                {
                    $unwind: "$userRoleData"
                },
                {
                    $lookup: {
                        from: "userPrivileges",
                        localField: 'user_privilege',
                        foreignField: "_id",
                        as: 'userPrivilegeData'
                    }
                },
                {
                    $unwind: "$userPrivilegeData"
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        email: 1,
                        mobile: 1,
                        company_id: 1,
                        user_privilege: 1,
                        role_id: 1,
                        user_role: "$userRoleData.user_role",
                        privilege: "$userPrivilegeData.privilege"
                    }
                }
            ])

        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json({status:200, data:users});
    },

    async roleByUsers(req, res, next){
        let documents;
        try {
            documents = await User.find({ company_id:req.params.company_id, role_id:req.params.role_id }).select('-createdAt -updatedAt -__v');
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }

        return res.json({status:200, data:documents});
    },

    async privilegeByUsers(req, res, next){
        let documents;
        try {
            documents = await User.find({ company_id:req.params.company_id, user_privilege:req.params.privilege_id }).select('_id name');
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }

        return res.json({status:200, data:documents});
    },

}

async function generateRandomUserId(){
    const unique_id = CustomFunction.randomUserId();
    try {
        const unique_id_exist = await User.exists({u_id:unique_id});
        if (unique_id_exist) {
            generateRandomUserId();
        }
    } catch (err) {
        return next(err)
    }
    return unique_id;
}


export default userController;