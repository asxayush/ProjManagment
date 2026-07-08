import { body } from "express-validator";
import {AvailabeUserRole} from "../utils/constant.js"


const userRegisterValidator = () =>
{
    return [
    body("email")
    .trim()
    .notEmpty()
    .withMessage("email required")
    .isEmail()
    .withMessage("email invalid"),
    body("username")
    .trim()
    .notEmpty()
    .withMessage("username is required")
    .isLowercase()
    .withMessage("username must be in lower case")
    .isLength({min: 3})
    .withMessage("username must be at least 3 char long"),
    body("password")
    .trim()
    .notEmpty()
    .withMessage("password is required"),
    body("fullName")
    .trim()
    .optional()
    
]

}


const userLoginValidator = () => {
    return [
        body("email")
        .optional()
        .isEmail()
        .withMessage("email is invalid"),
        body("password")
        .notEmpty()
        .withMessage("password is required")
    ]
}

const userChangeCurrentPasswordValidator = () => {
    return [
        body("oldPadword")
        .notEmpty()
        .withMessage("old password is required"),
        body("newPassword")
        .notEmpty()
        .withMessage("New password is required")
    ]
}

const userForgotPasswordValidator = () => {
    return [
        body("email")
        .notEmpty()
        .withMessage("email is required")
        .isEmail()
        .withMessage("email is invalid")
    ]
}

const userResetForgotPasswordValidator = () => {
    return [
        body("newPassword")
        .notEmpty()
        .withMessage("Password is required")
    ]
}

const createProjectValidator = () => {
    return [
        body("name")
        .notEmpty()
        .withMessage("Name is required"),
        body("description").optional()
    ]
}

const addMemberToProjectValidator = () => {
    return [
        body("email")
        .trim()
        .notEmpty()
        .withMessage("email is required")
        .isEmail()
        .withMessage("email is invalid"),
        body("role")
        .notEmpty()
        .withMessage("role is required")
        .isIn(AvailabeUserRole)
        .withMessage("role is invalid")
    ]
}

export{
    userRegisterValidator,
    userLoginValidator,
    userChangeCurrentPasswordValidator,
    userForgotPasswordValidator,
    userResetForgotPasswordValidator,
    createProjectValidator,
    addMemberToProjectValidator,
}