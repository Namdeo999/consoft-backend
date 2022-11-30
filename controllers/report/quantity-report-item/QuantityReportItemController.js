import Joi from "joi";
import { ObjectId } from "mongodb";
import { Item, QuantityReportItem } from "../../../models/index.js";
import CustomErrorHandler from "../../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../../services/CustomSuccessHandler.js";
import Constants from "../../../constants/index.js";

const QuantityReportItemController = {
  async index(req, res, next) {
    let documents;
    try {
      documents = await QuantityReportItem.aggregate([
        {
          $match: {
            // $and:[
            company_id: ObjectId(req.params.company_id),
            // ]
          },
        },
        {
          $lookup: {
            from: "units",
            localField: "unit_id",
            foreignField: "_id",
            as: "items",
          },
        },
        { $unwind: "$items" },

        {
          $project: {
            _id: 1,
            company_id: 1,
            unit_id: 1,
            item_name: 1,
            unit_name: "$items.unit_name",
          },
        },
      ]);
    } catch (error) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json({ status: 200, data: documents });
  },

  async store(req, res, next) {
    const quantityReportItemSchema = Joi.object({
      company_id: Joi.string().required(),
      item_name: Joi.string().required(),
      unit_id: Joi.string().required(),
    });

    const { error } = quantityReportItemSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { company_id, item_name, unit_id } = req.body;
    try {
      if (
        item_name.toLowerCase() == Constants.QUANTITY_ITEM_STEEL.toLowerCase()
      ) {
        const exist = await QuantityReportItem.exists({
          company_id: company_id,
          item_name: Constants.QUANTITY_ITEM_STEEL,
        }).collation({ locale: "en", strength: 1 });
        if (!exist) {
          await saveSteelQuantityItem(company_id, unit_id);
        }
        return next(
            CustomErrorHandler.alreadyExist("This item is already exist")
          );
      } else if (
        item_name.toLowerCase() ==
        Constants.QUANTITY_ITEM_PAINTING.toLowerCase()
      ) {
        const exist = await QuantityReportItem.exists({
          company_id: company_id,
          item_name: Constants.QUANTITY_ITEM_PAINTING,
        }).collation({ locale: "en", strength: 1 });
        if (!exist) {
          await savePaintingQuantityItem(company_id, unit_id);
        }
        return next(
            CustomErrorHandler.alreadyExist("This item is already exist")
          );
      } else if (
        item_name.toLowerCase() == Constants.QUANTITY_ITEM_FLORING.toLowerCase()
      ) {
        const exist = await QuantityReportItem.exists({
          company_id: company_id,
          item_name: Constants.QUANTITY_ITEM_FLORING,
        }).collation({ locale: "en", strength: 1 });
        if (!exist) {
          await saveFloringQuantityItem(company_id, unit_id);
        }
        return next(
            CustomErrorHandler.alreadyExist("This item is already exist")
          );
      } else if (
        item_name.toLowerCase() == Constants.QUANTITY_ITEM_PLASTER.toLowerCase()
      ) {
        const exist = await QuantityReportItem.exists({
          company_id: company_id,
          item_name: Constants.QUANTITY_ITEM_PLASTER,
        }).collation({ locale: "en", strength: 1 });
        if (!exist) {
          await savePlasterQuantityItem(company_id, unit_id);
        }
        return next(
            CustomErrorHandler.alreadyExist("This item is already exist")
          );
      } else {
        const exist = await QuantityReportItem.exists({
          company_id: company_id,
          item_name: item_name,
        }).collation({ locale: "en", strength: 1 });
        if (exist) {
          return next(
            CustomErrorHandler.alreadyExist("This item is already exist")
          );
        }
        const quantity_report_item = new QuantityReportItem({
          company_id,
          item_name,
          unit_id,
        });
        const result = await quantity_report_item.save();
    }
    res.send(CustomSuccessHandler.success("Item created successfull"));
    } catch (err) {
      return next(err);
    }
  },

  async edit(req, res, next) {},
  async update(req, res, next) {},
  async destroy(req, res, next) {},

  async steelQuantityItem(req, res, next) {
    let documents;
    try {
      await QuantityReportItem.find({
        company_id: req.params.company_id,
        item_name: "steel",
      })
        .select("-__v -company_id -unit_id")
        .then(function ([res]) {
          documents = res;
        });
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json({ status: 200, data: documents });
  },

  async paintingQuantityItem(req, res, next) {
    let documents;
    try {
      await QuantityReportItem.find({
        company_id: req.params.company_id,
        item_name: "painting",
      })
        .select("-__v -company_id -unit_id")
        .then(function ([res]) {
          documents = res;
        });
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json({ status: 200, data: documents });
  },

  async plasterQuantityItem(req, res, next) {
    let documents;
    try {
      await QuantityReportItem.find({
        company_id: req.params.company_id,
        item_name: "plaster",
      })
        .select("-__v -company_id -unit_id")
        .then(function ([res]) {
          documents = res;
        });
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json({ status: 200, data: documents });
  },

  async floringQuantityItem(req, res, next) {
    let documents;
    try {
      await QuantityReportItem.find({
        company_id: req.params.company_id,
        item_name: "flooring",
      })
        .select("-__v -company_id -unit_id")
        .then(function ([res]) {
          documents = res;
        });
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json({ status: 200, data: documents });
  },
};

async function saveSteelQuantityItem(company_id, unit_id) {
  try {
    const steel_item = new QuantityReportItem({
      company_id,
      item_name: Constants.QUANTITY_ITEM_STEEL,
      unit_id,
    });
    await steel_item.save();
  } catch (err) {
    return next(err);
  }
  return;
}

async function savePaintingQuantityItem(company_id, unit_id) {
  try {
    const painting_item = new QuantityReportItem({
      company_id,
      item_name: Constants.QUANTITY_ITEM_PAINTING,
      unit_id,
    });
    await painting_item.save();
  } catch (err) {
    return next(err);
  }
  return;
}

async function saveFloringQuantityItem(company_id, unit_id) {
  try {
    const floring_item = new QuantityReportItem({
      company_id,
      item_name: Constants.QUANTITY_ITEM_FLORING,
      unit_id,
    });
    await floring_item.save();
  } catch (err) {
    return next(err);
  }
  return;
}

async function savePlasterQuantityItem(company_id, unit_id) {
  try {
    const plaster_item = new QuantityReportItem({
      company_id,
      item_name: Constants.QUANTITY_ITEM_PLASTER,
      unit_id,
    });
    await plaster_item.save();
  } catch (err) {
    return next(err);
  }
  return;
}

export default QuantityReportItemController;
