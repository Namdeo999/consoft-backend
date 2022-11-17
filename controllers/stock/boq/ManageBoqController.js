import Joi from "joi";
import { ManageBoq, QuantityWorkItemReport } from "../../../models/index.js";
import { manageBoqSchema } from "../../../validators/index.js";
import CustomErrorHandler from "../../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../../services/CustomSuccessHandler.js";
import { ObjectId } from "mongodb";
import Constants from "../../../constants/index.js";

const ManageBoqController = {
  // async index(req, res, next) {
  //     let documents;
  //     let condition;

  // try {
  //     if ( req.params.project_id ) {
  //         condition = {"company_id": ObjectId(req.params.company_id),"project_id": ObjectId(req.params.project_id)}
  //     }else{
  //         condition = {"company_id": ObjectId(req.params.company_id)}
  //     }
  // documents = await ManageBoq.aggregate([
  //     {
  //         $match: {
  //             $and:[
  //                 condition
  //             ]
  //         },
  ///////////////////////////////
  // $match:{
  //     $and:[
  //         {
  //             $or: [
  //                 { "company_id": ObjectId(req.params.company_id) },
  //                 { "project_id": ObjectId(req.params.project_id) },

  //             ]
  //         },
  //         { "company_id": ObjectId(req.params.company_id) },
  //         // {"work_status":false},
  //         // {"verify":false},

  //     ]
  // }
  /////////////////////////////////
  //         },

  //         {
  //             $addFields: {
  //                 boqitems: {
  //                     $map: {
  //                         input: "$boqitems",
  //                         in: {
  //                             $mergeObjects: [
  //                             "$$this",
  //                                 {
  //                                     item_id: {
  //                                         $toObjectId: "$$this.item_id"
  //                                     }
  //                                 }
  //                             ]
  //                         }
  //                     }
  //                 }
  //             }
  //         },

  //         {
  //             $lookup: {
  //                 from: 'projects',
  //                 localField: 'project_id',
  //                 foreignField: '_id',
  //                 as: 'projectData'
  //             },
  //         },
  //         { $unwind: "$projectData" },
  //         {
  //             $lookup: {
  //                 from: 'quantityReportItems',
  //                 localField: 'boqitems.item_id',
  //                 foreignField: '_id',
  //                 as: 'reportItemData'
  //             },
  //         },
  //         {
  //             $lookup: {
  //                 from: 'units',
  //                 localField: 'boqitems.unit_id',
  //                 foreignField: '_id',
  //                 as: 'unitData'
  //             },
  //         },

  //         {
  //             $project: {
  //                 _id: 1,
  //                 company_id: 1,
  //                 project_id: 1,
  //                 project_name: "$projectData.project_name",
  //                 boqitems: {
  //                     $map: {
  //                         input: "$boqitems",
  //                         as: "i",
  //                         in: {
  //                             $mergeObjects:
  //                             [ "$$i",
  //                                 {
  //                                     $first: {
  //                                         $filter: {
  //                                             input: "$reportItemData",
  //                                             cond:
  //                                                 { $eq: ["$$this._id","$$i.item_id"] },
  //                                         },
  //                                     },
  //                                 },

  //                             ]
  //                         },

  //                     },
  //                 },
  //             }
  //         }

  //     ])
  // }
  // catch (error) {
  //     return next(CustomErrorHandler.serverError());
  // }
  // return res.json({ status: 200, data: documents });

  //sum

  // db.quantityWorkItemReports.aggregate([
  // {
  //     $match:{
  //       "item_id": ObjectId("62dd341a3285084614654976")
  //     }
  //   },
  //     { $unwind: "$subquantityitems" },
  //     {
  //          $group:
  //            {
  //              _id: "$quantity_report_id" ,
  //              totalAmount: { $sum: "$num_total"},
  //              subtotalAmount: { $sum: "$subquantityitems.sub_total"},
  //              count: { $sum: 1 }
  //            }
  //        }
  //     ]);

  // },

  async index(req, res, next) {
    let documents;
    // let condition;
    try {
      // if ( req.params.project_id ) {
      //     condition = {"company_id": ObjectId(req.params.company_id),"project_id": ObjectId(req.params.project_id)}
      // }else{
      //     condition = {"company_id": ObjectId(req.params.company_id)}
      // }
      documents = await ManageBoq.aggregate([
        {
          $match: {
            company_id: ObjectId(req.params.company_id),
            project_id: ObjectId(req.params.project_id),
            // condition
          },
        },
        {
          $lookup: {
            from: "quantityReportItems",
            localField: "item_id",
            foreignField: "_id",
            as: "quantityReportItemData",
          },
        },
        { $unwind: "$quantityReportItemData" },
        {
          $project: {
            id: 1,
            company_id: 1,
            project_id: 1,
            item_id: 1,
            item_name: "$quantityReportItemData.item_name",
            unit_name: 1,
            qty: 1,
            rate:1,
            amount:1,
            completed_qty: 1,
          },
        },
      ]);
    } catch (err) {
      return next(err);
    }
    return res.json({ status: 200, data: documents });
  },

  async boqcal(req, res, next) {
    let totalItem;
    let subTotalItem;
    totalItem = await QuantityWorkItemReport.aggregate([
      {
        $group: {
          _id: "$item_id",
          totalAmount: { $sum: "$num_total" },
          count: { $sum: 1 },
        },
      },
    ]);
    subTotalItem = await QuantityWorkItemReport.aggregate([
      // {
      //   $match:{
      //     "item_id": ObjectId("62dd342d3285084614654ba4")
      //   }
      // },
      { $unwind: "$subquantityitems" },
      {
        $group: {
          _id: "$item_id",
          // totalAmount: { $sum: "$num_total"},
          subtotalAmount: { $sum: "$subquantityitems.sub_total" },
          count: { $sum: 1 },
        },
      },
    ]);

    // totalItem.forEach(element => {

    // });

    return res.json({
      status: 200,
      totalItem: totalItem,
      subTotalItem: subTotalItem,
    });
  },

  async store(req, res, next) {
    const { error } = manageBoqSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    const { company_id, project_id, item_id, unit_name, qty, rate, amount } =
      req.body;
    try {
      const exist = await ManageBoq.exists({
        company_id: ObjectId(company_id),
        project_id: ObjectId(project_id),
        item_id: ObjectId(item_id),
      });
      if (exist) {
        return next(
          CustomErrorHandler.alreadyExist("This BOQ item is already exist")
        );
      }
      const createBoq = new ManageBoq({
        company_id,
        project_id,
        item_id,
        unit_name,
        qty,
        rate,
        amount: qty * rate,
      });     
      const result = await createBoq.save();
      res.send(CustomSuccessHandler.success("Boq created successfull"));
    } catch (err) {
      return next(err);
    }
  },
  async boqPercentCalc(req, res, next) {
    let total = 0;
    let perc=0;
    try {
      total = await ManageBoq.aggregate([
        { $group: { _id: null, sum_val: { $sum: "$amount" } } },
      ]);
      let [positionOne] = total;
      perc = (positionOne.sum_val*100);

    } catch (error) {
      return next(CustomErrorHandler.serverError());
    } 
    console.log('perc--',perc)
    return res.json({ status: Constants.RES_SUCCESS, data: perc });
  },

  async edit(req, res, next) {
    let document;
    try {
      document = await ManageBoq.findOne({ _id: req.params.id }).select("-__v");
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json({ status: Constants.RES_SUCCESS, data: document });
  },

  async update(req, res, next) {
    const { error } = manageBoqSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { company_id, project_id, item_id, unit_name, qty,rate } = req.body;
    try {
      // const exist = await ManageBoq.exists({ company_id: ObjectId(company_id), project_id: ObjectId(project_id), item_id: ObjectId(item_id) });
      // if (exist) {
      //     return next(CustomErrorHandler.alreadyExist('This BOQ item is already exist'));
      // }
      const createBoqq = await ManageBoq.findByIdAndUpdate(
        { _id: req.params.id },
        {
          company_id,
          project_id,
          item_id,
          unit_name,
          qty,
          rate
        },
        { upsert: true }
      );
      res.send(CustomSuccessHandler.success("Boq updated successfull"));
    } catch (err) {
      return next(err);
    }
  },

  // async store(req, res, next) {

  //     const { error } = manageBoqSchema.validate(req.body);
  //     if (error) {
  //         return next(error);
  //     }

  //     const { company_id, project_id, item_id, unit_id, qty } = req.body;
  //     try {

  //         let project_exist_id;
  //         const project_exist = await ManageBoq.exists({ company_id: ObjectId(company_id), project_id: ObjectId(project_id) });

  //         if (!project_exist) {
  //             const createProject = new ManageBoq({
  //                 company_id,
  //                 project_id,
  //             });
  //             const result = await createProject.save();
  //             project_exist_id = result._id;
  //         } else {
  //             project_exist_id = project_exist._id;
  //         }

  //         const item_exist = await ManageBoq.exists({ _id: ObjectId(project_exist_id), boqitems: { $elemMatch: { item_id: ObjectId(item_id) } } });
  //         if (item_exist) {
  //             return next(CustomErrorHandler.alreadyExist('This item is already exist'));
  //         }

  //         await ManageBoq.findByIdAndUpdate(
  //             { _id: ObjectId(project_exist_id) },
  //             {
  //                 $push: {
  //                     boqitems: {
  //                         item_id: item_id,
  //                         unit_id: unit_id,
  //                         qty: qty,
  //                     }
  //                 }
  //             },
  //             { new: true }
  //         )
  //         res.send(CustomSuccessHandler.success('Boq created successfull'));
  //     } catch (err) {
  //         return next(err);
  //     }

  // },

  // async edit(req, res, next){
  //     let document;

  //     try {
  //         // document = await ManageBoq.findOne({ _id:req.params.id, boqitems: { $elemMatch: { item_id: ObjectId(req.params.item_id) } } }).select('-__v');
  //     } catch (err) {
  //         return next(CustomErrorHandler.serverError());
  //     }

  //     return res.json(document);
  // },

  // async update(req, res, next){
  //     const { error } = manageBoqSchema.validate(req.body);
  //     if ( error ) {
  //         return next(error);
  //     }
  //     const { company_id, project_id, item_id, unit_id, qty } = req.body;
  //     try {

  //         const item_exist = await ManageBoq.exists({ _id: ObjectId(req.params.id), boqitems: { $elemMatch: { item_id: ObjectId(item_id) } } });
  //         if (item_exist) {
  //             return next(CustomErrorHandler.alreadyExist('This item is already exist'));
  //         }

  //         await ManageBoq.findOneAndUpdate(
  //             {
  //                 _id: { $eq: ObjectId(req.params.id) },"boqitems.item_id": ObjectId(req.params.item_id)
  //             },
  //             { $set:
  //                 {
  //                     "boqitems.$.item_id" : item_id,
  //                     "boqitems.$.unit_id" : unit_id,
  //                     "boqitems.$.qty" : qty
  //                 }
  //             }
  //         )
  //         res.send(CustomSuccessHandler.success('Boq updated successfull'));
  //     } catch (err) {
  //         return next(err);
  //     }
  // }
};

export default ManageBoqController;
