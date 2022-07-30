import { AssignWork, SubWorkAssign} from '../../models/index.js';
import { ObjectId } from 'mongodb'
import CustomErrorHandler from '../../services/CustomErrorHandler.js';
import CustomSuccessHandler from '../../services/CustomSuccessHandler.js';
import CustomFunction from '../../services/CustomFunction.js';

const UserAssignWorkController = {
    async index(req, res, next) {
        let documents;
        try {

            documents = await AssignWork.aggregate([
                {
                    $match: { user_id: ObjectId(req.params.user_id) }
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
                        from: "subWorkAssigns",
                        let: { "user_id": "$user_id" },
                        pipeline: [
                            {
                                // $match: {
                                //     // $expr: { $eq: ["$user_id", "$$user_id"] }
                                // }

                                $match:{
                                    $and:[
                                        {
                                            $expr: { $eq: ["$user_id", "$$user_id"] },
                                        },
                                        // {"work_status":false},
                                        // {"verify":false},

                                        {
                                            $or: [
                                                { "verify":false },
                                                { "work_status":true },
                                            ]
                                        },
                                        // {"exam":"annual_T","marks.p":{"$gte":"35"}}
                                    ]
                                }
                            },
                        ],
                        as: 'assign_works'
                    }
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
                    $project: {
                        role_id: 1,
                        user_id: 1,
                        user_role: "$userrole_collection.user_role",
                        user_name: "$users_collection.name",
                        assign_works: {
                            _id: 1,
                            assign_work_id: 1,
                            work_code: 1,
                            work: 1,
                            comment:1,
                            exp_completion_date:1,
                            exp_completion_time:1,
                            submit_work_text:1,
                            revert_msg:1,
                            revert_status:1,
                            work_status:1,
                            verify:1,
                        }
                    }
                }
            ])
            
        } catch (error) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json(documents);
    },

    async userWorkComment(req, res, next){
        try {
            const { comment } = req.body;
            const work_comment = await SubWorkAssign.findByIdAndUpdate(
                { _id: req.params.work_id },
                {
                    comment:comment,
                },
                { new: true }

            ).select('-__v');
        } catch (error) {
            return next(CustomErrorHandler.serverError());
        }
        res.send(CustomSuccessHandler.success("Comment submit successfully!"))
    },

    async userSubmitWork(req, res, next){
        try {
            const { submit_work_text } = req.body;
            const submit_date = CustomFunction.currentDate();
            const submit_time = CustomFunction.currentTime();
            const subwork_assign = await SubWorkAssign.findByIdAndUpdate(
                { _id: req.params.work_id },
                {
                    submit_work_text,
                    submit_work_date:submit_date,
                    submit_work_time:submit_time,
                    work_status:true,
                    revert_status:false,
                },
                { new: true }
            ).select('-__v');
        } catch (error) {
            return next(CustomErrorHandler.serverError());
        }
        res.send(CustomSuccessHandler.success("Selected work submit successfully!"))
    },

    async userCompletedWork(req, res, next){
        let documents;
        try {
            const exist = await SubWorkAssign.exists({user_id: req.params.user_id, verify: true});
            if (exist) {
                documents = await AssignWork.aggregate([
                    {
                        $match: { 
                            user_id: ObjectId(req.params.user_id) 
                        }
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
                                    $match:{
                                        $and:[
                                            {
                                                $expr: { $eq: ["$user_id", "$$user_id"] },
                                            },
                                            {"work_status":true},
                                            {"verify":true},
                                        
                                            // {"exam":"annual_T","marks.p":{"$gte":"35"}}
                                        ]
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
                                work_code: 1,
                                work: 1,
                                comment:1,
                                exp_completion_date:1,
                                exp_completion_time:1,
                                revert_msg:1,
                                revert_status:1,
                                work_status:1,
                                verify:1,
                            }
                        }
                    }

                ])
            } else {
                documents = CustomSuccessHandler.dataNotFound("Completed work not found")
            }
        } catch (error) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json(documents);
    },

    // async update(req, res, next) {

    //     const { exp_completion_time, comment } = req.body;
    //     try {
    //         const exist = await SubWorkAssign.exists({ _id: req.params.id });

    //         if (!exist) {
    //             return next(CustomErrorHandler.notExist('Work not found!'))
    //         }

    //         const subwork_assign = await SubWorkAssign.findByIdAndUpdate(
    //             { _id: req.params.id },
    //             {
    //                 comment,
    //                 exp_completion_time

    //             },
    //             { new: true }

    //         ).select('-createdAt -updatedAt -__v');

    //         res.send(CustomSuccessHandler.success("Data submitted to selected Work end successfully!"))

    //     } catch (error) {
    //         res.send(error)
    //     }

    // },


}
export default UserAssignWorkController;