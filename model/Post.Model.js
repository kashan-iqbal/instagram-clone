const mongoose = require("mongoose");

const PostSchema = mongoose.Schema(
  {
    body: {
      type: String,
      require: true,
    },
    photo: {
      image: {
        type: String,
      },
      imageId: {
        type: String,
      },
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

PostSchema.index({body:"text"})

module.exports = mongoose.model("POST", PostSchema);
