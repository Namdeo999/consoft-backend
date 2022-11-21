import Joi from "joi";
import { voucher, voucherDetails } from "../../models/index.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";
import CustomFunction from "../../services/CustomFunction.js";
const VoucherController = {
  async index(req, res, next) {
    let documents;
    document = await vouchers.aggregate([
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
    ]);
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
};
export default VoucherController;
