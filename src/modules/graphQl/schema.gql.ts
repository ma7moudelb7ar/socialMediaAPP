import { GraphQLObjectType, GraphQLSchema } from "graphql"
import UserFields from "../users/graphQl/user.fields"

    export const schemaGql = new GraphQLSchema({
        query :new GraphQLObjectType({
            name: "query",
            fields: {
            ...UserFields.query()
            }
        }),
        mutation: new GraphQLObjectType({
            name: "mutation",
            fields: {
                ...UserFields.mutation()
            }
        })
    })
    
