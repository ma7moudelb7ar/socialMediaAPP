

import { GraphQLEnumType, GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql"
import { GenderType } from "../../../common"

    const userType = new GraphQLObjectType({
    name: "user",
    fields: {
        _id: { type: new GraphQLNonNull(GraphQLID) },
        FName: { type: new GraphQLNonNull(GraphQLString) },
        LName: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        gender: {
        type: new GraphQLNonNull(
            new GraphQLEnumType({
            name: "EnumGenderUser",
            values: {
                male: { value: GenderType.male },
                female: { value: GenderType.female }
            }
            })
        )
        }
    }
    })
    
    export default userType