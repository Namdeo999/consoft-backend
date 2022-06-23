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
                        from: "subWorkAssigns",
                        localField: "user_id",
                        foreignField: "user_id",
                        as: 'subworkassign_colle'
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
                    $lookup: {
                        from: "users",
                        localField: "user_id",
                        foreignField: "_id",
                        as: 'users_collection',
                    }
                },


                {
                    $project: {
                        role_id: 1,
                        user_id: 1,
                        subworkassign_colle: {
                            _id: 1,
                            assign_work_id: 1,
                            work: 1,
                            status: 1
                        },
                        userrole_collection: { user_role: 1 },
                        users_collection: { name: 1 }
                    }
                },
                {
                    $unwind: { path: "$subworkassign_colle", preserveNullAndEmptyArrays: true },
                },
                {
                    $unwind: { path: "$userrole_collection", preserveNullAndEmptyArrays: true },
                },
                {
                    $unwind: { path: "$users_collection", preserveNullAndEmptyArrays: true },
                },

            ])

            // .then((result) => {
            //     console.log(result);
            // })
            // .catch((error) => {
            //     console.log(error);
            // });




        } catch (error) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json(documents);

    },
    async store(req, res, next) {

        const { role_id, user_id, work, status } = req.body;

        const assignWork = new AssignWork({
            role_id: role_id,
            user_id: user_id
        });


        const assign_result = await assignWork.save();

        if (assign_result) {


            // const { work, status } = req.body

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
                res.send(CustomSuccessHandler.success("Sub-assigned successfully!"))
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
        const { user_id, role_id, work, assign_user_id, status } = req.body;
        try {

            // document = await AssignWork.findByIdAndUpdate(
            //     { _id: req.params.id },
            //     {
            //         user_id,
            //         role_id,
            //     },
            //     { new: true }

            // ).select('-createdAt -updatedAt -__v');
            documents=await AssignWork.findOneAndUpdate(
                {_id:req.params.id},
                {
                    $set:{
                        role_id:role_id,
                        user_id:user_id
                    }
                },
                {new:true}
            )
       
                console.log(documents);
            if (documents) {
                documents = await SubWorkAssign.updateMany(
                    { _id: req.params.id },
                    {
                        $set: {
                            assign_work_id: documents._id,
                            user_id: documents.user_id,
                            work: work,
                            status: status
                        }
                    }
                )

            } else {
                console.log("not updated");
            }

            // console.log(mongoose.Types.ObjectId.isValid('62ad5db48966f5e867b8d58a'));

            // if (document) {

            //     list.forEach(async function (updated_list) {

            //         console.log("updated list= " + updated_list + typeof (updated_list));
            //         const update_ = updated_list;

            //         try {
            //             console.log(update_);
            //             document = await SubWorkAssign.updateMany({ "assign_work_id": "62adc25f6bc423e18fcb2a16" }, { $set: { "list_id": update_ } })

            //             if (document) {
            //                 console.log("running");
            //             } else {
            //                 console.log("not working");
            //             }

            //         } catch (error) {
            //             console.error(err);
            //             res.status(500).send("Server Error");
            //         }
            //     })
            // }

        } catch (err) {
            return next(err);
        }
        res.status(201).json(documents);
    },

    async destroy(req, res, next) {
        const document = await AssignWork.findOneAndRemove({ _id: req.params.id });
        const documents = await SubWorkAssign.findOneAndRemove({ _id: req.params.id });
        // const document = await AssignWork.deleteMany({})
        // const documents = await SubWorkAssign.deleteMany({})
        if (!document && !documents) {
            return next(new Error("Nothing to delete"))
        } else {
            return res.json(document)
        }
    }

}

export default AssignWorkController;