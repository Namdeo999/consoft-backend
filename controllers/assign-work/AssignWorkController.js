import { AssignWork, SubWorkAssign } from '../../models/index.js'
import { assignWorkSchema } from '../../validators/index.js';
import CustomErrorHandler from '../../services/CustomErrorHandler.js'
import CustomSuccessHandler from '../../services/CustomSuccessHandler.js'
import { ObjectId } from 'mongodb'
import CustomFunction from '../../services/CustomFunction.js';
const AssignWorkController = {

    async assignWork(req, res, next) {
        let documents;

        try {
            documents = await AssignWork.aggregate([
                // { "$match" : { "assign_works.user_id" : { "$exists" : false } } },
                {
                    $lookup: {
                        from: "userRoles",
                        localField: "role_id",
                        foreignField: "_id",
                        as: 'userrole_collection'
                    }
                },
                {
                    $unwind:"$userrole_collection"
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
                    $unwind:"$users_collection"
                },
                         
                {
                    $lookup: {
                        from: "subWorkAssigns",
                        let: { "user_id": "$user_id" },
                       pipeline:[
                        {
                            $match:{
                                $expr:{$eq:["$user_id","$$user_id"]}
                                
                            }
                        },
                        {
                            $sort: { exp_completion_time: 1, exp_completion_time: 1 }
                        }
                       ],
                        as: 'assign_works'
                    }
                },        
                {
                    $project: {
                        role_id: 1,
                        user_id: 1,
                        user_role:"$userrole_collection.user_role",
                        user_name:"$users_collection.name",
                        assign_works: {
                            _id: 1,
                            assign_work_id: 1,
                            work: 1,
                            work_code: 1,
                            exp_completion_date:1, 
                            exp_completion_time:1, 
                            status: 1
                        },
                    }
                }
            ])
        } catch (error) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json(documents);

    },

    async submitWork(req, res, next){
        let documents;
        try {
            documents = await SubWorkAssign.aggregate([
                {
                    $match:{
                        $and:[
                            {
                                "company_id": ObjectId(req.params.company_id),
                            },
                            { "work_status":true },
                            { "revert_status":false },
                            { "verify":false }
                        ]
                    },
                },
                {
                    $sort: { submit_work_date: -1, submit_work_time: -1 }
                },

                {
                    $lookup:{
                        from:"users",
                        localField:"user_id",
                        foreignField:"_id",
                        as:"userData"
                    }
                },
                {
                    $unwind:"$userData"
                },

                {
                    $lookup: {
                        from: "userRoles",
                        let: { "role_id": "$userData.role_id" },
                        pipeline:[
                        {
                            $match:{
                                $expr:{$eq:["$_id","$$role_id"]}
                            }
                        },
                        ],
                        as: 'userRole'
                    }
                }, 
                {
                    $unwind:"$userRole"
                },
                {
                    $project:{
                        _id:1,
                        user_name:"$userData.name",
                        user_role:"$userRole.user_role",
                        work_code:1,
                        work:1,
                        submit_work_text:1,
                        submit_work_date:1,
                        submit_work_time:1,
                        work_status:1
                    }
                },
            ])
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json(documents);
    },

    async store(req, res, next) {

        const {error} = assignWorkSchema.validate(req.body);
        if (error) {
            return next(error);
        }

        const { company_id, project_id, role_id, user_id, work, status, exp_completion_date, exp_completion_time } = req.body;
        let assign_result;
        try {
            const exist = await AssignWork.exists({user_id:req.body.user_id});
            if (exist) {
                assign_result = await AssignWork.findOne({ user_id:req.body.user_id }).select('-createdAt -updatedAt -__v');
                
            }else{
                const assignWork = new AssignWork({
                    company_id,
                    project_id,
                    role_id,
                    user_id
                });
    
                assign_result = await assignWork.save();
            }
        } catch (err) {
            return next(err);
        }
        
        if (assign_result) {

            const assign_work_id = assign_result._id;
            const assign_user_id = assign_result.user_id;
            const exp_date = CustomFunction.dateFormat(exp_completion_date);
            // const exp_time = CustomFunction.timeFormat(exp_completion_time);
            
            work.forEach(async function (elements) {
                const work_code = CustomFunction.randomNumber();
                const subwork_assign = new SubWorkAssign({
                    assign_work_id: assign_work_id,
                    company_id:company_id,
                    project_id:project_id,
                    user_id: assign_user_id,
                    work_code:work_code,
                    work: elements,
                    exp_completion_date:exp_date,
                    exp_completion_time,
                    // exp_completion_time: {$dateToString: { format: "%Y-%m-%d", date: "$exp_completion_time" } },
                    status:false
                })
                const sub_assign_result = subwork_assign.save()
            })

            try {
                res.send(CustomSuccessHandler.success("Work submitted successfully!"))
            } catch (error) {
                return next(error)
            }

        } else {
            res.send("There is no work assigned")
        }

    },

    async edit(req, res, next) {
        let document;
        try {
            document = await AssignWork.findOne({ _id: req.params.id }).select('-createdAt -updatedAt -__v');
            document = await SubWorkAssign.findOne({ _id: req.params.id }).select('-createdAt -updatedAt -__v');

        } catch (error) {
            return next(CustomErrorHandler.serverError())
        }
        return res.json(document);
    },

    async update(req, res, next) {

        let documents;
        let assign_result;
        const { user_id, role_id, work, status } = req.body;
        try {

            assign_result = await AssignWork.findByIdAndUpdate(
                { _id: req.params.id },
                {
                    user_id,
                    role_id,
                },
                { new: true }

            ).select('-createdAt -updatedAt -__v');
            if (assign_result) {
                documents = await SubWorkAssign.deleteMany(
                    { assign_work_id: req.params.id }
                )
            }
            const assign_work_id = assign_result._id;
            const assign_user_id = assign_result.user_id;

            const subwork_assign = new SubWorkAssign({
                assign_work_id: assign_work_id,
                user_id: assign_user_id,
                work,
                status
            })
            const sub_assign_result = subwork_assign.save()
        } catch (err) {
            return next(err);
        }
        res.status(201).json(documents);
    },

    async verifyRevertWorks(req, res, next){
        let documents;
        try {
            documents = await SubWorkAssign.aggregate([
                {
                    // { $sort: { score: { $meta: "textScore" }, posts: -1 } }
                    $match:{
                        $and: [
                            {
                                "company_id": ObjectId(req.params.company_id),
                            },
                            {
                                $or: [
                                    { "verify":true },
                                    { "revert_status":true },
                                ]
                            },
                        ]
                    },
                },
                {
                    $sort: { submit_work_date: -1, submit_work_time: -1 }
                },
                {
                    $lookup:{
                        from:"users",
                        localField:"user_id",
                        foreignField:"_id",
                        as:"userData"
                    }
                },
                {
                    $unwind:"$userData"
                },

                {
                    $lookup: {
                        from: "userRoles",
                        let: { "role_id": "$userData.role_id" },
                        pipeline:[
                        {
                            $match:{
                                $expr:{$eq:["$_id","$$role_id"]}
                            }
                        },
                        ],
                        as: 'userRole'
                    }
                }, 
                {
                    $unwind:"$userRole"
                },
                {
                    $project:{
                        _id:1,
                        user_name:"$userData.name",
                        user_role:"$userRole.user_role",
                        work_code:1,
                        work:1,
                        submit_work_text:1,
                        submit_work_date:1,
                        submit_work_time:1,
                        revert_status:1,
                        verify_date:1,
                        verify_time:1,
                        verify:1,
                    }
                },
            ])
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json({"status":200, data:documents});
    },

    async destroySubAssignWork(req, res, next) {

        // const data = await SubWorkAssign.findById({_id: req.params.id}, {_id:0, user_id:1});
        // let count;
        // if (data) {
        //     count = await SubWorkAssign.find({user_id: data.user_id}).count();
        // }
        // try {
        //     const document = await SubWorkAssign.findByIdAndRemove({ _id: req.params.id });
        //     if (count === 1) {
        //     }
        // } catch (err) {
            
        // }
        
        const document = await SubWorkAssign.findByIdAndRemove({ _id: req.params.id });

        if (!document) {
            return next(new Error("Nothing to delete"))
        } 
        return res.json({status:200})
    },

}

export default AssignWorkController;