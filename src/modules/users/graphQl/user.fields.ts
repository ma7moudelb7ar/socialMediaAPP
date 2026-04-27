import { GraphQLList } from "graphql"
import userType from "./user.type"
import userService from "../user.service"
import { userArgs, createUserArgs } from "./user.args"



    class UserFields {
    constructor() {}

    query = () => {
        return {
        getOneUser: {
            type: userType,
            args: userArgs,
            resolve:  userService.getOneUser
        },
        getUsers: {
            type: new GraphQLList(userType),
            resolve: userService.getUsers
        }
        }
    }



    mutation = () => {
        return {
        createUser: {
            type: userType,
            args: createUserArgs,
            // resolve: userService.createUser
        }
        }
    }
    }

    export default new UserFields()