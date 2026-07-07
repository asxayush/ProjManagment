import {User} from "../models/user.models.js"
import {Project} from "../models/project.models.js"
import {ProjectMember} from "../models/projectmember.models.js"
import { asyncHandler } from "../utils/async-handler.js"
import {ApiResponse} from "../utils/api-response.js"
import {ApiError} from "../utils/api-error.js"
import mongoose, { Mongoose } from "mongoose"
import { AvailableUserRole, UserRolesEnum } from "../utils/constant.js"



const getProjects = asyncHandler(async (req, res) => {
    const projects = await  ProjectMember.aggregate
    ([
            {
            $match :{
                user: new Mongoose.Types.ObjectId(req.user_id),
            },
        },
        {
            $lookup: {
                from: "projects",
                localField: "projects",
                foreignField:"_id",
                as: "projects",
                pipeline: [
                    {
                        $lookup: {
                            from: "projectmembers",
                            localField: "_id",
                            foreignField:"projects",
                            as: "projectmembers"
                        }
                    },
                    {
                        $addFields: {
                            members: {
                                $size: "$projectmembers", 
                            },
                        },
                    }
                ]
            },
        },
        {
            $unwind: "$projects"
        },
        {
            $project: {
                project: {
                    _id: 1,
                    name: 1,
                    desccription: 1,
                    members: 1,
                    createdAt: 1,
                    createdBy: 1,

                },
                role: 1,
                _id: 0
            }
        }

        ])

        return res
        .status(200)
        .json(new ApiResponse(
            200,
            projects,
            "Projects fetched successfully"
        ))
})


const getProjectById = asyncHandler(async (req, res) => {
   const {projectId} =  req.params

  const project =  await Project.findById(projectId)

  if(!project) {
    throw new ApiError(404, "Project not found")
  }

  return res
  .status(200)
  .json(new ApiResponse(
    200,
    project,
    "Project fetched successfully"
  ))
})

const createProject = asyncHandler(async (req, res) => {
   const {name, description} = req.body 

   const project = await Project.create({
    name,
    description,
    createdBy: new Mongoose.Types.ObjectId(req.user_id)
   })

   await ProjectMember.create(
   {
    user: new Mongoose.Types.ObjectId(req.user_id),
    project: new Mongoose.Types.ObjectId(req.project_id),
    role: UserRolesEnum.ADMIN
   }
   )

   return res
   .status(201)
   .json(
    new ApiResponse(
        201,
        project,
        "Project created successfully"
    )
   )
})

const  updateProject = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    const{projectId} = req.params

    const project =  await Project.findByIdAndUpdate(
            projectId,
            {
                name,
                description
            },
            {new: true}
        )

        if(!project){
            throw new ApiError(404, "Project not found")
        }

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Project updated successfully"
            )
        )
})

const deleteProject = asyncHandler(async (req, res) => {
   const {projectId} = req.params

   const project = await Project.findByIdAndDelete(projectId)

   if(!project){
            throw new ApiError(404, "Project not found")
        }

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Project deleted successfully"
            )
        )
})

const addMembersToProject  = asyncHandler(async (req, res) => {
   const{email, role} = req.body
   const {projectId} =  req.params
   const user = await User.findOne({email})

   if(!user){
    throw new ApiError(404, "User does not exists")
   }

   await ProjectMember.findByIdAndUpdate(
    {
        user: new Mongoose.Types.ObjectId(req.user_id),
        project: new Mongoose.Types.ObjectId(req.projectId)
    },
     {
        user: new Mongoose.Types.ObjectId(req.user_id),
        project: new Mongoose.Types.ObjectId(req.projectId),
        role: role
    },
    {
        new: true,
        upsert: true
    }
   )

   return res
   .status(201)
   .json(new ApiResponse(
    201,
    {},
    "Project member added successfully"
   ))
})

const  getProjectMembers = asyncHandler(async (req, res) => {
    const {projectId}= req.params
    const project = await Project.findById(req.params)

    if(!project){
        throw new ApiError(404, "project not found")
    }

    const projectmembers = await ProjectMember.aggregate([
        {
            $match: {
                project: new Mongoose.Types.ObjectId(projectId)
            },
        },

        {
            $lookup: {
                from: "users",
                localField: "users",
                foreignField: "_id",
                as: "user",
                pipeline: [
                    { 
                        $project: {
                            _id: 1,
                            username: 1,
                            fullName: 1,
                            avatar: 1,
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                user: {
                    $arrayElemAt: ["$user", 0]
                }
            }
        },
        {
            $projects: {
                project: 1,
                user: 1,
                role: 1,
                createdAt: 1,
                updatedAt: 1,
                _id: 0,
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(200, projectmembers, "Project members fetched")
    )
})

const updateMembersRole = asyncHandler(async (req, res) => {
   const {projectId, userId} = req.params
   const {newRole} = req.body

   if(!AvailableUserRole.includes(newRole)){
    throw new ApiError (400, "invalid Role")
   }

   let projectmember = await Project.findOne({
    project: new Mongoose.Types.ObjectId(projectId),
    user: new Mongoose.Types.ObjectId(req.user_id)
   })

   if(!ProjectMember){
    throw new ApiError (400, "Project member not found")
   }

  projectMember =  await ProjectMember.findByIdAndUpdate(
    projectMember._id,
    {
       role: newRole 
    },
    {new: true}
   )

   if(!ProjectMember){
    throw new ApiError (400, "Project member not found")
   }


   return res
    .status(200)
    .json(
        new ApiResponse(200, projectMember, "Project member role updated successfully")
    )
})

const deleteMember = asyncHandler(async (req, res) => {
     const {projectId, userId} = req.params
   

   

   let projectmember = await Project.findOne({
    project: new Mongoose.Types.ObjectId(projectId),
    user: new Mongoose.Types.ObjectId(req.user_id)
   })

   if(!ProjectMember){
    throw new ApiError (400, "Project member not found")
   }

  projectMember =  await ProjectMember.findByIdAndDelete(
    projectMember._id,
   
   )

   if(!ProjectMember){
    throw new ApiError (400, "Project member not found")
   }


   return res
    .status(200)
    .json(
        new ApiResponse(200, projectMember, "Project membereleted successfully")
    )
})

export{
    addMembersToProject,
    createProject,
    deleteMember,
    getProjectById,
    getProjectMembers,
    getProjects,
    updateProject,
    updateMembersRole,
}