var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
  text: String,
  author: {
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    },
    username: String
  }
});

var Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;