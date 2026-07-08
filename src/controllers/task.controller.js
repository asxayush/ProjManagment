import {User} from "../models/user.models.js"
import {Project} from "../models/project.models.js"
import {Task} from "../models/task.models.js"
import {SubTask} from "../models/task.models.js"
import { asyncHandler } from "../utils/async-handler.js"
import {ApiResponse} from "../utils/api-response.js"
import {ApiError} from "../utils/api-error.js"
import mongoose, { Mongoose } from "mongoose"
import { AvailableUserRole, UserRolesEnum } from "../utils/constant.js"


const getTasks = asyncHandler(async(req, res) => {
    //chai
})
const createTasks = asyncHandler(async(req, res) => {
    //chai
})
const getTaskById = asyncHandler(async(req, res) => {
    //chai
})
const updateTask = asyncHandler(async(req, res) => {
    //chai
})
const deleteTasks = asyncHandler(async(req, res) => {
    //chai
})
const createSubTask = asyncHandler(async(req, res) => {
    //chai
})
const updateSubTask = asyncHandler(async(req, res) => {
    //chai
})
const deleteSubTask = asyncHandler(async(req, res) => {
    //chai
})


export{
    createSubTask,
    createTasks,
    deleteSubTask,
    deleteTasks,
    updateSubTask,
    updateTask,
    getTaskById,
    getTasks
}
