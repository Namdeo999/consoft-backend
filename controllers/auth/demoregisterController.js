
import { User } from '../../models/index.js'
import { userSchema } from "../../validators/index.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import bcrypt from 'bcrypt';
import JwtService from '../../services/JwtService.js'
// import jwt from 'jsonwebtoken';

const registerController = {
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

        const { name, email, mobile, password, role_id } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            mobile,
            role_id,
            password: hashedPassword
        });
        let access_token;
        // let refresh_token;
        try {
            const result = await user.save();    
            // Token
            // access_token = JwtService.sign({ _id: result._id });
            access_token = JwtService.sign({ _id: result._id, role_id: result.role_id });

            // refresh_token = JwtService.sign({ _id: result._id, role: result.role }, '1y', REFRESH_SECRET);
            // // database whitelist
            // await RefreshToken.create({ token: refresh_token });
        } catch(err) {
            return next(err);
        }
        res.json({ access_token:access_token });
    }  
    
    
}


export default registerController;