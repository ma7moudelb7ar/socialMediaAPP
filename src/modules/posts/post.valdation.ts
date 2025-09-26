import { z as zod } from "zod";
import { generalRules } from "../../utils/generalRules";
import { AllowCommentEnum, AvailabilityEnum } from "../../dataBase/model/post.model";

export const createPostSchema = {
  body: zod.strictObject({
    content: zod.string().min(1).max(100000).optional(),
    attachments: zod.array(generalRules.file).optional(),
    allowComment: zod.enum(AllowCommentEnum).default(AllowCommentEnum.allow),
    availability: zod
      .enum(AvailabilityEnum)
      .default(AvailabilityEnum.public),
    tags: zod.array(generalRules.id).optional().refine((data) => {
      return new Set(data).size === data?.length;
    }, {
      message: "duplicated tags"
    }),
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
