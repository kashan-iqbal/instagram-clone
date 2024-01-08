const mongoose = require("mongoose");

const PostSchema = mongoose.Schema(
  {
    body: {
      type: String,
      require: true,
    },
    photo: {
      type: String,
      require: true,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "USER" }],
    comments: [
      {
        comment: { type: String },
        postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "USER" },
      },
    ],
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "USER",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("POST", PostSchema);
