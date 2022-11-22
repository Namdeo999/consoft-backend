import Joi from "joi";
import { voucher, voucherDetails } from "../../models/index.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";
import CustomFunction from "../../services/CustomFunction.js";
import { ObjectId } from "mongodb";
const VoucherController = {
  async index(req, res, next) {
    let documents;
    try {
      documents = await voucher.aggregate([
        {
          $match: {
            company_id: ObjectId(req.params.company_id),
            voucher_date: req.params.date,
          },
        },
        {
          $lookup: {
            from: "voucherDetails",
            localField: "_id",
            foreignField: "voucher_id",
            as: "voucherData",
          },
        },
        {
          $unwind: "$voucherData",
        },
        {
          $lookup: {
            from: "items",
            localField: "voucherData.item_id",
            foreignField: "_id",
            as: "itemData",
          },
        },
        {
          $unwind: "$itemData",
        },
        {
          $lookup: {
            from: "projects",
            localField: "project_id",
            foreignField: "_id",
            as: "projectData",
          },
        },
        {
          $unwind: "$projectData",
        },
        {
          $group: {
            _id: "$_id",
            company_id: { $first: "$company_id" },
            project_id: { $first: "$project_id" },
            project_name:{$first:"$projectData.project_name"},
            voucher_type: { $first: "$voucher_type" },
            verify_status: { $first: "$verify_status" },
            voucherData: {
              $push: {
                _id: "$voucherData._id",
                voucher_id: "$voucherData.voucher_id",
                item_id: "$voucherData.item_id",
                item_name: "$itemData.item_name",
                qty: "$voucherData.qty",
                vehicle_no: "$voucherData.vehicle_no",
                location: "$voucherData.location",
                remark: "$voucherData.remark",
              },
            },
          },
        },
        {
          $project: {
            _id: "$_id",
            verify_status: "$verify_status",
            company_id: "$company_id",
            // project_id: "$project_id",
            project_name:"$project_name",
            voucher_type: "$voucher_type",
            voucherData: "$voucherData",
          },
        },
      ]);
      return res.json({ status: 200, data: documents });
    } catch (err) {
      return next(err);
    }
  },
  async store(req, res, next) {
    const {
      voucher_type,
      item_id,
      location,
      vehicle_no,
      qty,
      remark,
      company_id,
      project_id,
    } = req.body;
    let current_date = CustomFunction.currentDate();
    let current_time = CustomFunction.currentTime();
    const voucherData = new voucher({
      company_id,
      project_id,
      voucher_type,
      voucher_date: current_date,
      voucher_time: current_time,
      verify_status: false,
    });
    const exist = await voucher.exists({
      company_id: company_id,
      project_id: project_id,
      voucher_type: voucher_type,
      voucher_date: current_date,
      voucher_time: current_time,
    });
    if (exist) {
      const voucherDetail = voucherDetails({
        voucher_id: exist._id,
        item_id: item_id,
        location: location,
        vehicle_no: vehicle_no,
        qty: qty,
        remark: remark,
      });
      const temp = await voucherDetail.save();
    } else {
      const result = await voucherData.save();
      const voucherId = result._id;
      const voucherDetail = voucherDetails({
        voucher_id: voucherId,
        item_id: item_id,
        location: location,
        vehicle_no: vehicle_no,
        qty: qty,
        remark: remark,
      });
      const temp = await voucherDetail.save();
    }

    try {
      res.send(CustomSuccessHandler.success("voucher created successfully"));
    } catch (err) {
      return next(err);
    }
  },
  async verifyVoucher(req, res, next) {
    let documents;
    try {
      documents = await voucher.findByIdAndUpdate(
        {
          _id: req.params.voucher_id,
        },
        {
          verify_status: true,
        },
        {
          new: true,
        }
      );
      res.json({ status: 200, data: documents });
    } catch (error) {
      return next(error);
    }
  },
};
export default VoucherController;
