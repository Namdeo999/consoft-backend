
import Joi from "joi";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import { User } from '../../models/index.js'
import bcrypt from 'bcrypt';
import JwtService from '../../services/JwtService.js'
// import jwt from 'jsonwebtoken';


const registerController = {
    async register(req, res, next){
        //velidation
        const registerSchema = Joi.object({
            name: Joi.string().min(5).max(15).required(), 
            email: Joi.string().email().required(),
            mobile: Joi.number().min(10).required(),
            role: Joi.string().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            //repeat_password: Joi.ref('password')
        });

        const {error} = registerSchema.validate(req.body);
        // console.log(error.message);
        
        if (error) {
            return next(error);
        }
        
        // check if user is in the database already
        try {
            const exist = await User.exists({mobile:req.body.mobile});
            if (exist) {
                // return next(CustomErrorHandler.alreadyExist('This email is already taken.'));
                return next(CustomErrorHandler.alreadyExist('This mobile is already taken.'));
            }

        } catch (err) {
            // return next(CustomErrorHandler.alreadyExist());
            return next(err);
        }

        const { name, email, mobile,password, role } = req.body;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // prepare the model

        const user = new User({
            name,
            email,
            mobile,
            role,
            password: hashedPassword
        });
        let access_token;
        // let refresh_token;
        try {
            const result = await user.save();
            console.log(result);
    
            // Token
            // access_token = JwtService.sign({ _id: result._id });
            access_token = JwtService.sign({ _id: result._id, role: result.role });

            // refresh_token = JwtService.sign({ _id: result._id, role: result.role }, '1y', REFRESH_SECRET);
            // // database whitelist
            // await RefreshToken.create({ token: refresh_token });
        } catch(err) {
            return next(err);
        }
    
        // res.json({ access_token, refresh_token });
        res.json({ access_token:access_token });

        // res.json({msg:'hello rohit namdeo'});
    }   
}


export default registerController;