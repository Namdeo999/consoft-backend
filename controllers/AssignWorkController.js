import { AssignWork, SubWorkAssign, UserRole, User } from './../models/index.js'
import CustomErrorHandler from '../services/CustomErrorHandler.js'
import CustomSuccessHandler from '../services/CustomSuccessHandler.js'
import { ObjectId } from 'mongodb'
import mongoose from "mongoose";
const AssignWorkController = {

    async index(req, res, next) {
        let documents;

        try {

            documents = await AssignWork.aggregate([
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
                        // mobile:"$users_collection.mobile",
                        assign_works: {
                            _id: 1,
                            assign_work_id: 1,
                            work: 1,
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
    async store(req, res, next) {


        const exist = await AssignWork.exists({ user_id: req.body.user_id });
        // const assign_work_id = AssignWork._id;
        // const fetch_assign_work_id=await AssignWork.find({user})
        // console.log(exist);
        if (exist) {
            const { work } = req.body;
            const add_subwork_assign = new SubWorkAssign({
                work,
                user_id: req.body.user_id,
                assign_work_id:exist
            });
            await add_subwork_assign.save();
            res.json("work added successfully!")
        } else {
            const { role_id, user_id, work, status } = req.body;
            const assignWork = new AssignWork({
                role_id,
                user_id
            });

            const assign_result = await assignWork.save();

            if (assign_result) {

                const assign_work_id = assign_result._id;
                const assign_user_id = assign_result.user_id;

                work.forEach(async function (elements) {
                    const subwork_assign = new SubWorkAssign({
                        assign_work_id: assign_work_id,
                        user_id: assign_user_id,
                        work: elements,
                        status
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

    async destroy(req, res, next) {
        const document = await AssignWork.findOneAndRemove({ _id: req.params.id });
        const documents = await SubWorkAssign.findOneAndRemove({ _id: req.params.id });
        if (!document && !documents) {
            return next(new Error("Nothing to delete"))
        } else {
            return res.json(document)
        }
    }

}
// SDFLSDKF

export default AssignWorkController;
