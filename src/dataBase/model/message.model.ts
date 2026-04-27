import { Schema, Types, model } from "mongoose";
import { IMessage } from "../../common";

const messageSchema = new Schema<IMessage>(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true
    },

    content: {
      type: String,
      trim: true
    },

    attachments: {
      type: [String]
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    seenBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  {
    timestamps: true
  }
);

// لازم الرسالة يكون فيها content أو attachment
messageSchema.pre("save", function (next) {
  if (!this.content && (!this.attachments || this.attachments.length === 0)) {
    return next(new Error("Message must contain content or attachment"));
  }
  next();
});

// Index مهم جداً
messageSchema.index({ chatId: 1, createdAt: -1 });

export const messageModel = model<IMessage>("Message", messageSchema);
