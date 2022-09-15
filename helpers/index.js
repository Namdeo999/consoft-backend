import { ObjectId } from "mongodb";
import { Report,QuantityReport, ManageBoq, QuantityWorkItemReport } from "../models/index.js";
import { manageBoqSchema } from "../validators/index.js";
import CustomErrorHandler from "../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../services/CustomSuccessHandler.js";

export default{

    async totalQuantityItemWotk(quantity_work_item_report_id){
        let total_qty_work ;
        // console.log(quantity_work_item_report_id)
        try {
            await QuantityWorkItemReport.aggregate([
                {
                    $match:{
                        "_id": ObjectId(quantity_work_item_report_id)
                    }
                },
                
                // { $unwind: "$subquantityitems" },
                { $unwind: { path: "$subquantityitems", preserveNullAndEmptyArrays: true } },
                {
                    $group:
                    {
                        _id: "$item_id" ,
                        "main_id": { "$first": "$_id" },
                        "quantity_report_id": { "$first": "$quantity_report_id" },
                        "num_total": { "$first": "$num_total" },
                        subtotalAmount: { $sum: "$subquantityitems.sub_total"},
                        count: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        _id:"$main_id",
                        item_id:"$_id",
                        quantity_report_id:"$quantity_report_id",
                        total_quantity : { '$add' : [ '$subtotalAmount', '$num_total' ] },
                    }
                }
            ]).then(function ([res]) {
                total_qty_work = res;
            });
            
        } catch (error) {
            return ({status:400, msg:"return catch block"})
        }
        return total_qty_work;
    },

    async saveCompletedBoqQuantity(report_id, item_id, unit_name, completed_qty){
        const report_exist = await Report.exists({_id: ObjectId(report_id) }).select('company_id project_id report_status');
        try {
            const exist = await ManageBoq.exists({ company_id: ObjectId(report_exist.company_id), project_id: ObjectId(report_exist.project_id), item_id: ObjectId(item_id) });
            if (!exist) {
                const createBoq = new ManageBoq({
                    company_id:report_exist.company_id,
                    project_id:report_exist.project_id,
                    item_id,
                    unit_name,
                    qty:0,
                    completed_qty:completed_qty,
                });
                const result = await createBoq.save();
            }else{
                const createBoqq = await ManageBoq.findByIdAndUpdate(
                    {_id:exist._id},
                    {
                        completed_qty:completed_qty,
                    },
                    {new:true}
                );
            }
            
        } catch (err) {
            return (err);
        }
        return ({ status:200 });

    },

    async updateCompletedBoqQuantity(quantity_report_id, item_id, completed_qty, pre_total_qty){
        const quantity_report = await QuantityReport.findOne({_id: ObjectId(quantity_report_id) }).select('report_id');
        let total_qty;
        if (quantity_report) {
            const report = await Report.findOne({_id: ObjectId(quantity_report.report_id) }).select('company_id project_id');
            try {
                const exist = await ManageBoq.findOne({ company_id: ObjectId(report.company_id), project_id: ObjectId(report.project_id), item_id: ObjectId(item_id) }).select('_id completed_qty');
                if (exist) {
                    total_qty = parseFloat(exist.completed_qty) - parseFloat(pre_total_qty);
                    total_qty = parseFloat(total_qty) + parseFloat(completed_qty);
                    const updateBoq = await ManageBoq.findByIdAndUpdate(
                        {_id:exist._id},
                        {
                            completed_qty:total_qty,
                        },
                        {new:true}
                    );
                }
            } catch (err) {
                return (err)
            }
            return ({status:200});
        }
    },

    async deleteCompletedBoqQuantity(quantity_report_id, item_id, pre_total_qty){
        const quantity_report = await QuantityReport.exists({_id: ObjectId(quantity_report_id) }).select('report_id');
        let total_qty;
        if (quantity_report) {
            const report = await Report.findOne({_id: ObjectId(quantity_report.report_id) }).select('company_id project_id');
            try {
                const exist = await ManageBoq.findOne({ company_id: ObjectId(report.company_id), project_id: ObjectId(report.project_id), item_id: ObjectId(item_id) }).select('_id completed_qty');
                if (exist) {
                    total_qty = parseFloat(exist.completed_qty) - parseFloat(pre_total_qty);
                    const updateBoq = await ManageBoq.findByIdAndUpdate(
                        {_id:exist._id},
                        {
                            completed_qty:total_qty,
                        },
                        {new:true}
                    );
                    // console.log(total_qty)
                }
            } catch (err) {
                return (err)
            }
            return ({status:200});
        }
    }
    
}

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