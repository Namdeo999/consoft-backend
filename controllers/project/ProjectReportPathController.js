import { ProjectReportPath } from "../../models/index.js";
import { projectReportPathSchema } from "../../validators/index.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import { ObjectId } from "mongodb";

const ProjectReportPathController = {

    async index(req, res, next){
        let documents;
        try {
            documents = await ProjectReportPath.aggregate([
                {
                    $match:{
                      "company_id":ObjectId(req.params.company_id),
                      "project_id":ObjectId(req.params.project_id)
                    }
                },
                {
                    $lookup: { 
                        from: 'projects',
                        let: { "project_id": '$project_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ["$_id", "$$project_id"] },
                                }
                            },
                            {
                            $project: {
                                    "_id": 0,
                                    "project_name": 1
                                }
                            }
                        ],
                        as: 'projectData'
                    },
                },
                {$unwind:"$projectData"},
                {
                    $lookup: { 
                        from: 'users',
                        let: { "started_by": "$started_by"  },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ["$_id", "$$started_by"] },
                                }
                            },
                            {
                                $project: {
                                    "_id": 0,
                                    "name": 1
                                }
                            }
                        ],
                        as: 'startedByData'
                    },
                },
                {$unwind:"$startedByData"},
                {
                    $lookup: { 
                        from: 'users',
                        let: { "verification_1":"$verification_1"},
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ["$_id", "$$verification_1"] },
                                }
                            },
                            {
                              $project: {
                                    "_id": 0,
                                    "name": 1
                                }
                            }
                        ],
                        as: 'verification1Data'
                    },
                },
                {$unwind:"$verification1Data"},
                {
                    $lookup: { 
                        from: 'users',
                        let: { "verification_2":"$verification_2" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ["$_id", "$$verification_2"] },
                                }
                            },
                            {
                              $project: {
                                    "_id": 0,
                                    "name": 1
                                }
                            }
                        ],
                        as: 'verification2Data'
                    },
                },
                {$unwind:"$verification2Data"},
                {
                    $lookup: { 
                        from: 'users',
                        let: { "admin_1": "$admin_1" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ["$_id", "$$admin_1"] },
                                }
                            },
                            {
                              $project: {
                                    "_id": 0,
                                    "name": 1
                                }
                            }
                        ],
                        as: 'admin1Data'
                    },
                },
                {$unwind:"$admin1Data"},
                {
                    $lookup: { 
                        from: 'users',
                        let: { "admin_2": "$admin_2" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ["$_id", "$$admin_2"] },
                                }
                            },
                            {
                              $project: {
                                    "_id": 0,
                                    "name": 1
                                }
                            }
                        ],
                        as: 'admin2Data'
                    },
                },
                {$unwind:"$admin2Data"},
                {
                    $lookup: { 
                        from: 'companies',
                        let: { "company_id": "$company_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ["$_id", "$$company_id"] },
                                }
                            },
                            {
                              $project: {
                                    "_id": 0,
                                    "name": 1
                                }
                            }
                        ],
                        as: 'companyData'
                    },
                },
                {$unwind:"$companyData"},
                {
                    $project:{
                        _id:1,
                        company_id:1,
                        project_id:1,
                        project_name:"$projectData.project_name",
                        started_by:1,
                        started_by_name:"$startedByData.name",
                        verification_1:1,
                        verification_1_name:"$verification1Data.name",
                        verification_2:1,
                        verification_2_name:"$verification2Data.name",
                        admin_1:1,
                        admin_1_name:"$admin1Data.name",
                        admin_2:1,
                        admin_2_name:"$admin2Data.name",
                        final_verify:"$companyData.name",
                    }
                }

            ]);
        } catch (err) {
            return next(err);
        }
        return res.json({ "status": 200, data:documents });
    },

    async store(req, res, next){
        const { error } = projectReportPathSchema.validate(req.body);
        if(error){
            return next(error);
        }

        const {company_id, project_id, started_by, verification_1, verification_2, admin_1, admin_2, final_verify} = req.body;
        try {
            const exist = await ProjectReportPath.exists( { company_id:ObjectId(company_id), project_id:ObjectId(project_id)} );
            if (exist) {
                return next(CustomErrorHandler.alreadyExist('This project report path is already exist'));
            }
        } catch (err) {
            return next(err);
        }

        const project_report_path = new ProjectReportPath({
            company_id,
            project_id,
            started_by,
            verification_1,
            verification_2,
            admin_1,
            admin_2,
            final_verify
        });
        try {
            const result = await project_report_path.save();
        } catch (err) {
            return next(err);
        }
        res.send(CustomSuccessHandler.success('Project report path created successfully'));
    },

    async update(req, res, next){
        const { error } = projectReportPathSchema.validate(req.body);
        if(error){
            return next(error);
        }
        const {company_id, project_id, started_by, verification_1, verification_2, admin_1, admin_2, final_verify} = req.body;
        try {
            // const exist = await ProjectReportPath.exists({ company_id:ObjectId(company_id), project_id:ObjectId(project_id)});
            // if (!exist) {
            //     return next(CustomErrorHandler.alreadyExist('This project report path is already exist'));
            // }
            await ProjectReportPath.findOneAndUpdate(
                { _id: req.params.id},
                {
                    started_by, 
                    verification_1, 
                    verification_2, 
                    admin_1, 
                    admin_2,
                    final_verify 
                },
                {new: true}
            );
        } catch (err) {
            return next(err);
        }
        return res.send(CustomSuccessHandler.success("Project report path updated successfully"))
    },

    async destroy(req, res,next){
        const document = await ProjectReportPath.findOneAndRemove({ _id: req.params.id });
        if (!document) {
            return next(new Error('Nothing to delete'));
        }
        // return res.send({"status":200,"message": "Category deleted successfully" })
        return res.send(CustomSuccessHandler.success("Project report path deleted successfully"))
    }

}

export default ProjectReportPathController;