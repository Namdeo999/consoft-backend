import { AssignWork, SubWorkAssign, UserRole, User } from '../../models/index.js'
import CustomErrorHandler from '../../services/CustomErrorHandler.js'
import CustomSuccessHandler from '../../services/CustomSuccessHandler.js'
import { ObjectId } from 'mongodb'
import mongoose from "mongoose";

const UserAssignWorkController={
    async index(req, res, next) {

        let documents;
        try {

            documents = await AssignWork.aggregate([
                {
                    $match: { user_id: ObjectId(req.params.id) }
                },
                {
                    $lookup: {
                        from: "userRoles",
                        localField: "role_id",
                        foreignField: "_id",
                        as: 'userrole_collection'
                    }
                },
                {
                    $unwind: "$userrole_collection"
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "user_id",
                        foreignField: "_id",
                        as: 'users_collection',
                    }
                },
                {
                    $unwind: "$users_collection"
                },
                {
                    $lookup: {
                        from: "subWorkAssigns",
                        let: { "user_id": "$user_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ["$user_id", "$$user_id"] }
                                }
                            },
                        ],
                        as: 'assign_works'
                    }
                },
                {
                    $project: {
                        role_id: 1,
                        user_id: 1,
                        user_role: "$userrole_collection.user_role",
                        user_name: "$users_collection.name",
                        assign_works: {
                            _id: 1,
                            assign_work_id: 1,
                            work: 1,
                            comment:1,
                            exp_completion_time:1,
                            revert_comment:1,
                            revert_status:1,
                            status: 1
                        }
                    }
                }
            ])
        } catch (error) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json(documents);

    },
    async update(req,res,next){

        const {  exp_completion_time, comment } = req.body;
        try {
        const exist = await SubWorkAssign.exists({ _id: req.params.id });
        
            if(!exist) {
                return next(CustomErrorHandler.notExist('Work not found!'))
            }
            
            const subwork_assign = await SubWorkAssign.findByIdAndUpdate(
            { _id: req.params.id },
            {
                comment,
                exp_completion_time
       
            },
            { new: true }

            ).select('-createdAt -updatedAt -__v');   
          
            res.send(CustomSuccessHandler.success("Data submitted to selected Work end successfully!"))
            
        } catch (error) {
            res.send(error)
        }

    }
}
export default UserAssignWorkController;