import Joi from "joi";
import { User, RefreshToken } from "../../models/index.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import bcrypt from 'bcrypt';
import JwtService from "../../services/JwtService.js";
import { REFRESH_SECRET } from "../../config/index.js";
import AttendanceController from "../user-profile/AttendanceController.js";

const loginController = {
    async login(req, res, next){

        const loginSchema = Joi.object({
            mobile:Joi.string().pattern(/^[0-9]{10}$/).required(),
            // mobile:Joi.number().required(),
            // password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            password: Joi.string().required(),
        });
        const {error} = loginSchema.validate(req.body);
        
        if(error){
            return next(error);
        }
        try {
            var user_detail;
            // const user_detail = await User.findOne({mobile: req.body.mobile});
            await User.aggregate([
                {
                    $match: {
                        "mobile": req.body.mobile
                    }
                },
                {
                    $lookup: {
                        from: 'companies',
                        localField: 'company_id',
                        foreignField: '_id',
                        as: 'companyData'
                    },
                },
                { $unwind: "$companyData" },
                {
                    $lookup: {
                        from: 'userPrivileges',
                        localField: 'user_privilege',
                        foreignField: '_id',
                        as: 'userPrivilegeData'
                    },
                },
                { $unwind: "$userPrivilegeData" },
                {
                    $project:{
                        _id:1,
                        company_id:1,
                        company_name:'$companyData.company_name',
                        role_id: 1,
                        password:1,
                        name:1,
                        mobile:1,
                        email:1,
                        user_privilege: '$userPrivilegeData.privilege',
                    }
                }
            ]).then(function ([res]) {
                user_detail = res;
            });
            
            // const bpass = await bcrypt.hash(req.body.password, 10)
            // const match = await bcrypt.compare(req.body.password,user_detail.password);
            // console.log(bpass)
            // console.log("object")
            // console.log(user_detail)
            // console.log(match)
            // console.log(user_detail.password)

            if(!user_detail){
                return next(CustomErrorHandler.wrongCredentials())
            }
            // compare the password
            const match = await bcrypt.compare(req.body.password,user_detail.password);
            if (!match) {
                return next(CustomErrorHandler.wrongCredentials());
            }
            //generate token
            const access_token = JwtService.sign({ _id: user_detail._id, role_id: user_detail.role_id });
            const refresh_token = JwtService.sign({ _id: user_detail._id, role_id: user_detail.role_id }, '1y', REFRESH_SECRET);

            await RefreshToken.create({ token: refresh_token });

            res.json({status:200, access_token, refresh_token, _id: user_detail._id, company_id:user_detail.company_id, company_name:user_detail.company_name, role_id: user_detail.role_id, name: user_detail.name, mobile:user_detail.mobile, email:user_detail.email, user_privilege:user_detail.user_privilege });

        } catch (err) {
            return next(err);
        }
    },

    async logout(req, res, next) {
        // validation
        const refreshSchema = Joi.object({
            user_id: Joi.string(),
            refresh_token: Joi.string().required(),
        });
        const { error } = refreshSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        const {user_id, refresh_token} = req.body;
        const bodyData = {
            user_id: user_id,
        }

        try {
            const result = await AttendanceController.attendanceOutTime(bodyData);
            if (result.status === 200) {
                await RefreshToken.deleteOne({ token: refresh_token });
            }
        } catch(err) {
            return next(new Error('Something went wrong in the database'));
        }
        return res.send({ status: 200 });
    }

};

export default loginController;