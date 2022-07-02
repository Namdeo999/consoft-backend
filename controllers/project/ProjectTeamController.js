import { ProjectTeam } from "../../models/index.js";
import { projectTeamSchema } from "../../validators/index.js";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import CustomSuccessHandler from "../../services/CustomSuccessHandler.js";
import { ObjectId } from "mongodb";


const projectTeamController = {

    async index(req, res, next){
        let documents;
       
        try {
            // documents = await ProjectTeam.find({project_id:req.params.id}).select('-createdAt -updatedAt -__v');

            documents =  await ProjectTeam.aggregate([
                {
                    $match: {
                        "project_id": ObjectId(req.params.id)
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
                { $unwind: "$project_data" },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'users.user_id',
                        foreignField: '_id',
                        as: 'user_arr'
                    },
                },
                
                {
                    $project: {
                            project_id:'$project_data._id',
                            project_name:'$project_data.project_name',
                            project_team: {
                            $map: {
                                input: '$user_arr',
                                as: 'users_data',
                                in: {
                                $mergeObjects: [
                                    {
                                        user_id: '$$users_data._id',
                                        user_name: '$$users_data.name',
                                    },
                                    // {$indexOfArray: ['$my_array.user_id', '$$users_data._id']},
                                ],
                            }
                        
                            }
                        }
                    }
            
                } 
                
            ])
          
            // documents =  await ProjectTeam.aggregate([
            //     {
            //         $match: {
            //             "project_id": ObjectId(req.params.id)
            //         }
            //     },
            //     {
            //         $lookup: {
            //             from: "projects",
            //             localField: "project_id",
            //             foreignField: "_id",
            //             as: 'data'
            //         }
            //     },
            //     {$unwind:"$data"}, 
            //     {
            //         $project: {
            //             _id: 1,
            //             project_id: 1,
            //             project_name:"$data.project_name",
            //         }
            //     } 
            // ])
            // .then(function ([res]) {
            //     user = res;
            // })

        } catch (err) {
            return next(CustomErrorHandler.serverError());
        }
        return res.json(documents);
    },

    async store(req, res, next){
        // console.log(req.body.user_id);
        const {error} = projectTeamSchema.validate(req.body);
        if(error){
            return next(error);
        }
        // check exist
        const {project_id, user_id} = req.body;

        

        const project_exist = await ProjectTeam.exists({project_id:project_id});
        if (project_exist) {

            // const user_exist = await ProjectTeam.find({"users.user_id":{$exists:true, $eq:[user_id]}})
            // if(user_exist){
            //     return next(CustomErrorHandler.alreadyExist('This user is already exist on this project'));
            // }
            
            const document = await ProjectTeam.findOneAndUpdate( 
            // await ProjectTeam.findOneAndUpdate( 
                {project_id:ObjectId(project_id)},
                // { $push: { 
                //     users: {
                //         user_id : user_id,
                //       }  
                //     } 
                // },

                {
                    $push: {
                      'users': {
                        $each:user_id.map((id) => {
                          return { user_id: id };
                        }),
                      },
                    },
                },
                {new:true} 
            )
        }else{
            const project_team = new ProjectTeam({
                project_id,
                users: {
                    user_id : user_id,
                }  
            });
            const result = await project_team.save();
            // const result = await project_team.save().then( (res) => console.log(res));
        }

        try {
            res.send(CustomSuccessHandler.success('Project assign successfully'));
        } catch (err) {
            return next(err);
        }

    },

}

export default projectTeamController;