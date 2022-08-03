import Joi from "joi";
import { User, RefreshToken } from "../../models/index.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import bcrypt from 'bcrypt';
import JwtService from "../../services/JwtService.js";
import { REFRESH_SECRET } from "../../config/index.js";

const loginController = {
    async login(req, res, next){

        const loginSchema = Joi.object({
            // email: Joi.string().email().required(),
            mobile:Joi.number().required(),
            // password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            password: Joi.string().required(),
        });

        const {error} = loginSchema.validate(req.body);

        if(error){
            return next(error);
        }

        try {
            const user = await User.findOne({mobile: req.body.mobile});
            if(!user){
                return next(CustomErrorHandler.wrongCredentials())
            }

            // console.log(user)
            // compare the password
            const match = await bcrypt.compare(req.body.password,user.password);
            if (!match) {
                return next(CustomErrorHandler.wrongCredentials());
            }

            //generate token
            const access_token = JwtService.sign({ _id: user._id, role_id: user.role_id });
            const refresh_token = JwtService.sign({ _id: user._id, role_id: user.role_id }, '1y', REFRESH_SECRET);

            await RefreshToken.create({ token: refresh_token });

            res.json({status:200, access_token, refresh_token, _id: user._id, company_id:user.company_id, role_id: user.role_id });

        } catch (err) {
            return next(err);
        }
    },

    async logout(req, res, next) {
        // validation
        const refreshSchema = Joi.object({
            refresh_token: Joi.string().required(),
        });
        const { error } = refreshSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        try {
            await RefreshToken.deleteOne({ token: req.body.refresh_token });
        } catch(err) {
            return next(new Error('Something went wrong in the database'));
        }
        res.json({ status: 1 });
    }

};



export default loginController;