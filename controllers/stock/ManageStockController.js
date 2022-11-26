import Joi from "joi";
import { ManageStock, StockEntry } from "../../models/index.js";
import { manageStockSchema } from "../../validators/index.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import CustomFunction from "../../services/CustomFunction.js";
import { ObjectId } from "mongodb";

const ManageStockController = {
  async index(req, res, next) {
    let documents;
    try {
      documents = await db.manageStock.aggregate([
        {
          $match: {
            company_id: ObjectId(req.params.company_id),
            // voucher_date: req.params.date,
          },
        },
        {
          $lookup: {
            from: "stockEntries",
            localField: "_id",
            foreignField: "stock_id",
            as: "stockData",
          },
        },
        {
          $unwind: "$stockData",
        },
        {
          $lookup: {
            from: "items",
            localField: "stockData.item_id",
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
            _id: "$project_id",
            company_id: { $first: "$company_id" },
            project_id: { $first: "$project_id" },
            project_name: { $first: "$projectData.project_name" },
            stockData: {
              $push: {
                _id: "$stockData._id",
                stock_id: "$stockData.voucher_id",
                item_id: "$stockData.item_id",
                stock_date: "$stock_date",
                item_name: "$itemData.item_name",
                qty: "$stockData.qty",
              },
            },
          },
        },
        {
          $project: {
            _id: "$_id",
            company_id: "$company_id",
            project_name: "$project_name",
            stockData: "$stockData",
          },
        },
      ]);
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json({ status: 200, data: documents });
  },

  async store(req, res, next) {
    const { error } = manageStockSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { company_id, project_id, user_id, stockEntry } = req.body;

    const stock_exist = await ManageStock.exists({
      company_id: ObjectId(company_id),
      project_id: ObjectId(project_id),
      user_id: ObjectId(user_id),
    });
    let stock_id;
    try {
      if (!stock_exist) {
        const manage_stock = new ManageStock({
          company_id,
          project_id,
          user_id,
        });
        const result = await manage_stock.save();
        stock_id = result._id;
      } else {
        stock_id = stock_exist._id;
      }
    } catch (err) {
      return next(err);
    }

    let current_date = CustomFunction.currentDate();
    let current_time = CustomFunction.currentTime();

    try {
      stockEntry.forEach((stock) => {
        const stock_entry = new StockEntry({
          stock_id: ObjectId(stock_id),
          item_id: ObjectId(stock.item_id),
          unit_name: stock.unit_name,
          qty: stock.qty,
          location: stock.location,
          vehicle_no: stock.vehicle_no,
          entry_date: current_date,
          entry_time: current_time,
        });
        stock_entry.save();
      });
    } catch (err) {
      return next(err);
    }
    res.send(CustomSuccessHandler.success("Stock entry successfully"));
  },

  async edit(req, res, next) {
    let document;
    try {
      document = await ManageStock.findOne({ _id: req.params.id }).select(
        "-createdAt -updatedAt -__v"
      );

      // document = await ManageStock.aggregate([
      //     {
      //       $lookup: {
      //         from: "items",
      //         localField: "item_id",
      //         foreignField: "_id",
      //         as: "items",
      //       },
      //     },

      // ]);
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }

    return res.json(document);
  },

  async update(req, res, next) {
    const manageStockSchema = Joi.object({
      item_id: Joi.string().required(),
      qty: Joi.number().required(),
      location: Joi.string().required(),
      vehicle_no: Joi.string().required(),
    });

    const { error } = manageStockSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { item_id, qty, location, vehicle_no } = req.body;
    let document;
    try {
      document = await ManageStock.findByIdAndUpdate(
        { _id: req.params.id },
        {
          item_id,
          qty,
          location,
          vehicle_no,
        },
        { new: true }
      ).select("-createdAt -updatedAt -__v");
    } catch (err) {
      return next(err);
    }
    res.status(201).json(document);
  },

  async destroy(req, res, next) {
    const document = await ManageStock.findOneAndRemove({ _id: req.params.id });
    if (!document) {
      return next(new Error("Nothing to delete"));
    }
    return res.json(document);
  },
};

export default ManageStockController;
