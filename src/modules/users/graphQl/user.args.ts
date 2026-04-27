
import { GraphQLID, GraphQLNonNull, GraphQLString, GraphQLEnumType } from "graphql";
import { GenderType } from "../../../common";

export  const  userArgs = {
                id: { type: new GraphQLNonNull(GraphQLID) }
                }

                
                export const createUserArgs = {
                name: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) },
                gender: { type: new GraphQLNonNull(new GraphQLEnumType({
                    name: "GenderType",
                    values: {
                        male: { value: GenderType.male },
                        female: { value: GenderType.female }
                    }
                })) }
                }
