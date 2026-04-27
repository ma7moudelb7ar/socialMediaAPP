import { Schema, model } from "mongoose";
import { IFriend, StatusFriend } from "../../common";

const friendSchema = new Schema<IFriend>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: StatusFriend,
      default: StatusFriend.pending,
    },
    acceptedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

friendSchema.pre(["findOne", "find"], function (next) {
  const query = this.getQuery();
  const { paranoid, ...rest } = query as any;

  if (paranoid === false) {
    this.setQuery({ ...rest });
  } else {
    this.setQuery({ ...rest, deletedAt: { $exists: false } });
  }
  next();
});


export const friendModel = model<IFriend>("Friend", friendSchema);
