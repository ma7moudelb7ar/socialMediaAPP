import { Schema, Types, model } from "mongoose";
import { IChat } from "../../common";

const chatSchema = new Schema<IChat>(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
      }
    ],

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    group: {
      type: Boolean,
      default: false
    },

    groupName: {
      type: String
    },

    groupImage: {
      type: String
    },

    lastMessage: {
      content: String,
      attachments: [String],
      createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
      },
      createdAt: Date
    },

    roomId: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Index لتحسين الأداء
chatSchema.index({ participants: 1 });
chatSchema.index({ updatedAt: -1 });

export const chatModel = model<IChat>("Chat", chatSchema);
