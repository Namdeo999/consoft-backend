import { ObjectId } from "mongodb";
import {
  Report,
  QuantityReport,
  ManageBoq,
  QuantityWorkItemReport,
  StockEntry,
  voucherDetails,
  ManageStock
} from "../models/index.js";
import { manageBoqSchema } from "../validators/index.js";
import CustomErrorHandler from "../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../services/CustomSuccessHandler.js";
import constants from "../constants/index.js";
import CustomFunction from "../services/CustomFunction.js";

export default {
  async totalQuantityItemWotk(quantity_work_item_report_id) {
    let total_qty_work;
    // console.log(quantity_work_item_report_id)
    try {
      await QuantityWorkItemReport.aggregate([
        {
          $match: {
            _id: ObjectId(quantity_work_item_report_id),
          },
        },

        // { $unwind: "$subquantityitems" },
        {
          $unwind: {
            path: "$subquantityitems",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: "$item_id",
            main_id: { $first: "$_id" },
            quantity_report_id: { $first: "$quantity_report_id" },
            num_total: { $first: "$num_total" },
            subtotalAmount: { $sum: "$subquantityitems.sub_total" },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: "$main_id",
            item_id: "$_id",
            quantity_report_id: "$quantity_report_id",
            total_quantity: { $add: ["$subtotalAmount", "$num_total"] },
          },
        },
      ]).then(function ([res]) {
        total_qty_work = res;
      });
    } catch (error) {
      return { status: 400, msg: "return catch block" };
    }
    return total_qty_work;
  },

  async saveCompletedBoqQuantity(report_id, item_id, unit_name, completed_qty) {
    const report_exist = await Report.exists({
      _id: ObjectId(report_id),
    }).select("company_id project_id report_status");
    try {
      const exist = await ManageBoq.exists({
        company_id: ObjectId(report_exist.company_id),
        project_id: ObjectId(report_exist.project_id),
        item_id: ObjectId(item_id),
      });
      if (!exist) {
        const createBoq = new ManageBoq({
          company_id: report_exist.company_id,
          project_id: report_exist.project_id,
          item_id,
          unit_name,
          qty: 0,
          completed_qty: completed_qty,
        });
        const result = await createBoq.save();
      } else {
        const createBoqq = await ManageBoq.findByIdAndUpdate(
          { _id: exist._id },
          {
            completed_qty: completed_qty,
          },
          { new: true }
        );
      }
    } catch (err) {
      return err;
    }
    return { status: 200 };
  },

  async updateCompletedBoqQuantity(
    quantity_report_id,
    item_id,
    completed_qty,
    pre_total_qty
  ) {
    const quantity_report = await QuantityReport.findOne({
      _id: ObjectId(quantity_report_id),
    }).select("report_id");
    let total_qty;
    if (quantity_report) {
      const report = await Report.findOne({
        _id: ObjectId(quantity_report.report_id),
      }).select("company_id project_id");
      try {
        const exist = await ManageBoq.findOne({
          company_id: ObjectId(report.company_id),
          project_id: ObjectId(report.project_id),
          item_id: ObjectId(item_id),
        }).select("_id completed_qty");
        // console.log("completed_qty--", completed_qty);

        if (exist) {
          total_qty =
            parseFloat(exist.completed_qty) - parseFloat(pre_total_qty);
          total_qty = parseFloat(total_qty) + parseFloat(completed_qty);

          const updateBoq = await ManageBoq.findByIdAndUpdate(
            { _id: exist._id },
            {
              completed_qty: total_qty,
            },
            { new: true }
          );
        }
      } catch (err) {
        return err;
      }
      return { status: 200 };
    }
  },

  async deleteCompletedBoqQuantity(quantity_report_id, item_id, pre_total_qty) {
    const quantity_report = await QuantityReport.exists({
      _id: ObjectId(quantity_report_id),
    }).select("report_id");
    let total_qty;
    if (quantity_report) {
      const report = await Report.findOne({
        _id: ObjectId(quantity_report.report_id),
      }).select("company_id project_id");
      try {
        const exist = await ManageBoq.findOne({
          company_id: ObjectId(report.company_id),
          project_id: ObjectId(report.project_id),
          item_id: ObjectId(item_id),
        }).select("_id completed_qty");
        if (exist) {
          total_qty =
            parseFloat(exist.completed_qty) - parseFloat(pre_total_qty);
          const updateBoq = await ManageBoq.findByIdAndUpdate(
            { _id: exist._id },
            {
              completed_qty: total_qty,
            },
            { new: true }
          );
          // console.log(total_qty)
        }
      } catch (err) {
        return err;
      }
      return { status: 200 };
    }
  },
  async availableStock(voucher_type, id,company_id,project_id) {


    if (voucher_type == constants.RECEIVED_VOUCHER) {
      const vouchDetails = await voucherDetails
        .findOne({
          _id: ObjectId(id),
        })
        .select();
        const stock_exist = await ManageStock.exists({company_id: ObjectId(company_id), project_id: ObjectId(project_id)});
        let stock_id
        let current_date = CustomFunction.currentDate();
        let current_time = CustomFunction.currentTime();
        try {
            if (!stock_exist) {
                const manage_stock = new ManageStock({
                    company_id,
                    project_id,
                    stock_date:current_date,
                    stock_time:current_time
                    // user_id 
                });
                const result = await manage_stock.save();
                stock_id = result._id;
            }else{
                stock_id = stock_exist._id;
            }
        } catch (err) {
            return err;
        }

    
      const StockEntryData = new StockEntry({
        stock_id:stock_id,
        qty: vouchDetails.qty,
        item_id: vouchDetails.item_id,
      });

      const stockData = await StockEntry.findOne({
        stock_id:stock_id,
        item_id: vouchDetails.item_id,
      }).select();

      if (stockData == null) {
        const result = await StockEntryData.save();
      } else {
        const temp = await StockEntry.findByIdAndUpdate(
          { _id: stockData._id },
          {
            qty: vouchDetails.qty + stockData.qty,
          },
          { new: true }
        );
      }
    } else {
      if (voucher_type == constants.RECEIVED_RETURN_VOUCHER) {
        const vouchDetails = await voucherDetails
          .findOne({
            _id: ObjectId(id),
          })
          .select();
          const stock_exist = await ManageStock.exists({company_id: ObjectId(company_id), project_id: ObjectId(project_id)});
          let stock_id
          let current_date = CustomFunction.currentDate();
          let current_time = CustomFunction.currentTime();
          try {
              if (!stock_exist) {
                  const manage_stock = new ManageStock({
                      company_id,
                      project_id,
                      stock_date:current_date,
                      stock_time:current_time
                      // user_id 
                  });
                  const result = await manage_stock.save();
                  stock_id = result._id;
              }else{
                  stock_id = stock_exist._id;
              }
          } catch (err) {
              return err;
          }
  
        const stockData = await StockEntry.findOne({
          stock_id:stock_id,
          item_id: vouchDetails.item_id,
        }).select();

        if (stockData != null) {
          const temp = await StockEntry.findByIdAndUpdate(
            { _id: stockData._id },
            {
              qty: stockData.qty - vouchDetails.qty,
            },
            { new: true }
          );
        }
      }
    }
    return { status: 200 };
  },
};

// $2b$10$Rtf33hrnKbSmMWNbx5XfveviP2K5gdyckS808s97KWGernVNRUqhi

// db.quantityWorkItemReports.aggregate([
//     {
//       $match:{
//         "_id": ObjectId("631d85437a9b73f46f7adddd")
//       }
//     },
//     { $unwind: "$subquantityitems" },
//     {
//         $group:
//         {
//             _id: "$item_id" ,
//             "main_id": { "$first": "$_id" },
//             "quantity_report_id": { "$first": "$quantity_report_id" },
//             "num_total": { "$first": "$num_total" },
//             subtotalAmount: { $sum: "$subquantityitems.sub_total"},
//             count: { $sum: 1 }
//         }
//     },
//     {
//         $project: {
//           _id:"$main_id",
//           item_id:"$_id",
//           num_total:"$num_total",
//           quantity_report_id:"$quantity_report_id",
//           subtotalAmount:"$subtotalAmount",
//           count:"$count",
// totalSum : { '$add' : [ '$subtotalAmount', '$num_total' ] },
//         }
//     }

//     ])
