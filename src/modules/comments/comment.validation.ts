import * as z from "zod";
import { generalRules } from "../../utils";
import { onModelEnum } from "../../common";


export const createCommentSchema = {
  params : z.strictObject ({
    postId : generalRules.id,
    commentId : generalRules.id.optional(),
  }),
  body: z.strictObject({
    content: z.string().min(1).max(100000).optional(),
    attachments: z.array(generalRules.file).optional(),
    assetFolderId : z.string().optional(),
    onModel : z.enum(onModelEnum),
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




export type createCommentSchemaType  = z.infer<typeof createCommentSchema.body>

