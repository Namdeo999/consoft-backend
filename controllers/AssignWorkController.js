import { AssignWork, SubWorkAssign } from './../models/index.js'
import Joi from 'joi'
import CustomErrorHandler from '../services/CustomErrorHandler.js'
import CustomSuccessHandler from '../services/CustomSuccessHandler.js'
// import {ObjectId}  from 'mongodb'
import mongoose from "mongoose";
const AssignWorkController = {

    async index(req, res, next) {
        let documents;
        try {
            documents = await AssignWork.find().select('-createdAt -updatedAt -__v');
        } catch (error) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json(documents);

    },

    async store(req, res, next) {

        const { role_id, list } = req.body;

        const assignWork = new AssignWork({
            role_id: role_id,
            list: list
        });


        const assign_result = await assignWork.save();

        if (assign_result) {

            let obj_id;
            const { work } = req.body
            const assign_work_ids = await AssignWork.find({}, { _id: 1 }).sort({ _id: -1 }).limit(1)
            assign_work_ids.map(item => {
                obj_id = String(item._id.valueOf())
            });

            list.forEach(function (value) {
                const subwork_assign = new SubWorkAssign({
                    assign_work_id: obj_id,
                    list_id: value,
                    work: work
                })
                const sub_assign_result = subwork_assign.save()
            });


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

        let document;
        const { list, role_id, work, list_id } = req.body;
        try {
            document = await AssignWork.findByIdAndUpdate(
                { _id: req.params.id },
                {
                    list,
                    role_id,
                },
                { new: true }

            ).select('-createdAt -updatedAt -__v');
            // console.log(mongoose.Types.ObjectId.isValid('62ad5db48966f5e867b8d58a'));

            if (document) {
                let updated_assign_work

                list.forEach(async function (updated_list) {
                    var assign_work_id = req.params.id;
                    console.log("updated list= " + updated_list + ' assign work id= ' + assign_work_id);
                    updated_assign_work = await SubWorkAssign.findByIdAndUpdate(
                       assign_work_id,
                       { list_id: updated_list },
                       { new: true }
                   ).select('-createdAt -updatedAt -__v')

                })

                try {
                    res.send(CustomSuccessHandler.success("Sub-assigned successfully!"))
                } catch (error) {
                    return next(error)
                }
                // if (updated_assign_work) {
                //     res.status(201).json(updated_assign_work)
                // } else {
                //     res.send("not updating")

                // }
            }

            document = await SubWorkAssign.findByIdAndUpdate(
                { _id: req.params.id },
                {
                    list_id,
                    work
                },
                { new: true },
            ).select('-createdAt -updatedAt -__v');
        } catch (err) {
            return next(err);
        }
        res.status(201).json(document);
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