import { ProjectTeam } from "../../models/index.js";
import { projectTeamSchema } from "../../validators/index.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";
import { ObjectId } from "mongodb";
import CustomFunction from "../../services/CustomFunction.js";

const projectTeamController = {

    async index(req, res, next) {
        let documents;
        try {
            documents = await ProjectTeam.aggregate([
                {
                    $match: {
                        "project_id": ObjectId(req.params.project_id)
                    }
                },
                {
                    $lookup: {
                        from: 'projects',
                        localField: 'project_id',
                        foreignField: '_id',
                        as: 'projectData'
                    },
                },
                { $unwind: "$projectData" },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user_id',
                        foreignField: '_id',
                        as: 'userData'
                    },
                },
                { $unwind: "$userData" },
                {
                    $lookup: {
                        from: "userRoles",
                        localField: 'userData.role_id',
                        foreignField: '_id',
                        as: 'userRoleData'
                    }
                },
                {
                  $unwind:"$userRoleData"
                },
                {
                    $project: {
                        _id:1,
                        company_id:1,
                        project_id: 1,
                        project_name: '$project_data.project_name',
                        user_id: 1,
                        user_name: '$userData.name',
                        role_id: '$userRoleData._id',
                        user_role: '$userRoleData.user_role',
                    }
                }

            ]);
        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json({status:200, data:documents});
    },

    async store(req, res, next){
        const { error } = projectTeamSchema.validate(req.body);
        if (error) {
            return next(error);
        }

        const teamExist = [];
        try {

            const { company_id, project_id, user_id } = req.body;
            
            user_id.forEach( async (list, key) => {

                const exist = await ProjectTeam.findOne({ company_id:ObjectId(company_id), project_id: ObjectId(project_id), user_id:ObjectId(list)});
                
                if (exist) {
                    // return next(CustomErrorHandler.alreadyExist(CustomFunction.capitalize(`${privilege} is already exist`)));
                    // return next(CustomErrorHandler.alreadyExist('This project category is already exist'));
                    // teamExist.push(`${key+1} DS` );
                    return ;                    
                }
                
                // if (teamExist.length > 0) {
                //     return ;
                // }
                const project_team = new ProjectTeam({
                    company_id,
                    project_id,
                    user_id:list
                });

                const result = await project_team.save();
            });
        } catch (err) {
            return next(err);
        }
        res.send(CustomSuccessHandler.success('Project team created successfully'));
    },

    async update(req, res, next){
        const { error } = projectTeamSchema.validate(req.body);
        if (error) {
            return next(error);
        }  
        const { company_id, project_id, user_id } = req.body;
        try {
            for (const item of user_id) {
                
                const exist = await ProjectTeam.exists({ company_id:ObjectId(company_id), project_id: ObjectId(project_id), user_id:ObjectId(item)})
                if (exist) {
                    return next(CustomErrorHandler.alreadyExist('User is already exist in this project'));
                }
                await ProjectTeam.findByIdAndUpdate(
                    {_id:req.params.id},
                    {
                        project_id,
                        user_id
                    },
                    {new: true}
                );
            }

        } catch (err) {
            return next(err);
        }
        res.send(CustomSuccessHandler.success('Project team updated successfully'));
    },

    async destroy(req, res, next) {
        const document = await ProjectTeam.findByIdAndRemove({ _id: req.params.id });
        if (!document) {
            return next(new Error('Nothing to delete'));
        }
        return res.send(CustomSuccessHandler.success("Project team deleted successfully"))
    },

    //$2b$10$PyVMhfU2qArD2ZNipyqJlO47KOKIS2s68KwLWRXcC.RSKJDzoQSa. //9mauu9// user pass

    // async index(req, res, next) {
    //     let documents;

    //     try {
    //         // documents = await ProjectTeam.find({project_id:req.params.id}).select('-createdAt -updatedAt -__v');

    //         documents = await ProjectTeam.aggregate([
    //             {
    //                 $match: {
    //                     "project_id": ObjectId(req.params.id)
    //                 }
    //             },
    //             {
    //                 $lookup: {
    //                     from: 'projects',
    //                     localField: 'project_id',
    //                     foreignField: '_id',
    //                     as: 'project_data'
    //                 },
    //             },
    //             { $unwind: "$project_data" },
    //             {
    //                 $lookup: {
    //                     from: 'users',
    //                     localField: 'users.user_id',
    //                     foreignField: '_id',
    //                     as: 'user_arr'
    //                 },
    //             },
                
    //             {
    //                 $project: {
    //                     project_id: '$project_data._id',
    //                     project_name: '$project_data.project_name',
    //                     project_team: {
    //                         $map: {
    //                             input: '$user_arr',
    //                             as: 'users_data',
    //                             in: {
    //                                 $mergeObjects: [
    //                                     {
    //                                         user_id: '$$users_data._id',
    //                                         user_name: '$$users_data.name',
    //                                         role_id: '$$users_data.role_id',
    //                                         mobile: '$$users_data.mobile',
    //                                         email: '$$users_data.email',
    //                                     },
    //                                     // {$indexOfArray: ['$my_array.user_id', '$$users_data._id']},
    //                                 ],
    //                             }

    //                         }
    //                     }
    //                 }

    //             }

    //         ])

    //         // documents =  await ProjectTeam.aggregate([
    //         //     {
    //         //         $match: {
    //         //             "project_id": ObjectId(req.params.id)
    //         //         }
    //         //     },
    //         //     {
    //         //         $lookup: {
    //         //             from: "projects",
    //         //             localField: "project_id",
    //         //             foreignField: "_id",
    //         //             as: 'data'
    //         //         }
    //         //     },
    //         //     {$unwind:"$data"}, 
    //         //     {
    //         //         $project: {
    //         //             _id: 1,
    //         //             project_id: 1,
    //         //             project_name:"$data.project_name",
    //         //         }
    //         //     } 
    //         // ])
    //         // .then(function ([res]) {
    //         //     user = res;
    //         // })

    //     } catch (err) {
    //         return next(CustomErrorHandler.serverError());
    //     }
    //     return res.json({status:200, data:documents});
    // },

    

    // async store(req, res, next) {
       
    //     const { error } = projectTeamSchema.validate(req.body);
    //     if (error) {
    //         return next(error);
    //     }

    //     const { project_id, user_id } = req.body;
    //     let project_exist_id
    //     const project_exist = await ProjectTeam.findOne({ project_id: ObjectId(project_id) }).select('_id');
    //     // project_exist_id = await ProjectTeam.exists({ project_id: ObjectId(project_id) });

    //     if (!project_exist) {
    //         const project_team = new ProjectTeam({
    //             project_id
    //         });
    //         const result = await project_team.save();
    //         project_exist_id = result._id;
    //     }else{
    //         project_exist_id = project_exist._id;
    //     }
    //     // console.log(project_exist_id);
    //     try {
    //         let project;
    //         user_id.forEach( async (element) => {
    //             project = await ProjectTeam.find({
    //                 $and: [
    //                     { project_id: { $eq: ObjectId(project_id) }, users: { $elemMatch: { user_id: ObjectId(element) } } }
    //                 ]
    //             })
    
    //             if (project.length === 0) {
    //                 await ProjectTeam.findByIdAndUpdate(
    //                     { _id: ObjectId(project_exist_id) },
    //                     // { $push: {users: {user_id : user_id,} } }, // single code insert
    //                     {
    //                         $push: {users: {user_id : ObjectId(element)} } 
    //                     },
    //                     { new: true }
    //                 )
    //             }
    //         });

    //         res.send(CustomSuccessHandler.success('Project assign successfully'));
    //     } catch (err) {
    //         return next(err);
    //     }
    // },

    

    // async destroy(req, res, next) {
    //     const {project_id, user_id} = req.params;
    //     const document = await ProjectTeam.findOneAndUpdate(
    //         { project_id: ObjectId(project_id) },
    //         // { $push: {users: {user_id : user_id,} } }, // single code insert
    //         {
    //             $pull: {users: {user_id : ObjectId(user_id)} } 
    //         },
    //         { new: true }
    //         // false, // Upsert
    //         // true, // Multi
    //     )

    //     if (!document) {
    //         return next(new Error('Nothing to delete'));
    //     }
    //     // return res.json(document);
    //     return res.json(CustomSuccessHandler.success("Team member deleted successfully"));
    // },

    async projectTeamRoleWise(req, res, next){
        let documents;
        try {
            // documents = await ProjectTeam.find({project_id:req.params.id}).select('-createdAt -updatedAt -__v');
            documents = await ProjectTeam.aggregate([
                {
                    $match: {
                        "project_id": ObjectId(req.params.project_id)
                    }
                },
                {
                    $lookup: {
                        from: 'projects',
                        localField: 'project_id',
                        foreignField: '_id',
                        as: 'project_data'
                    },
                },
            ])

        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json(documents);
    },
}

export default projectTeamController;