import * as z from "zod";
import { AllowCommentEnum, AvailabilityEnum } from "../../common";
import { generalRules } from "../../utils";
import { actionEnum } from "../../common";


export const createPostSchema = {
  body: z.strictObject({
    content: z.string().min(1).max(100000).optional(),
    attachments: z.array(generalRules.file).optional(),
    allowComment: z.enum(AllowCommentEnum).default(AllowCommentEnum.allow),
    assetFolderId : z.string().optional(),
    availability: z
      .enum(AvailabilityEnum)
      .default(AvailabilityEnum.public),
    tags: z.array(generalRules.id).refine((data) => {
      return new Set(data).size === data?.length;
    }, {
      message: "duplicated tags"
    }).optional(),
  }).superRefine((data, ctx) => {
    if (!data.attachments?.length && !data.content) {
      ctx.addIssue({
        code: "custom",
        path: ["content"],
        message: "attachments and content is empty you must fill one",
      });
    }
  }),
};


export const updatePostSchema = {
  body: z.strictObject({
    content: z.string().min(1).max(100000).optional(),
    attachments: z.array(generalRules.file).optional(),
    allowComment: z.enum(AllowCommentEnum).default(AllowCommentEnum.allow),
    assetFolderId : z.string().optional(),
    availability: z
      .enum(AvailabilityEnum)
      .default(AvailabilityEnum.public),
    tags: z.array(generalRules.id).refine((data) => {
      return new Set(data).size === data?.length;
    }, {
      message: "duplicated tags"
    }).optional(),
  }).superRefine((data, ctx) => {
    if (!Object.values(data).length) {
      ctx.addIssue({
        code: "custom",
        message: "attachments and content is empty you must fill one",
      });
    }
  }),
};

export const likeSchema = {
  params: z.strictObject({
    PostId :generalRules.id
  }),
  query: z.strictObject({
    action :z.enum(actionEnum).default(actionEnum.like)
  }),
};



export type likeSchemaType  = z.infer<typeof likeSchema.params>
export type likeSchemaQueryType  = z.infer<typeof likeSchema.query>
