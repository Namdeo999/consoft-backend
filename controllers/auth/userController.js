import { ObjectId } from "mongodb";
import { User } from "../../models/index.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";

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

        return res.json(documents);
    },

}

export default userController;