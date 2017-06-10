var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
  text: String,
  author: {
    id: {
        type: mongoose.Schema.Types.ObjectId, // cannot use === with this id type against another String
        ref: "Comment"
    },
    username: String,
    dateCreated: {type: Date, default: Date.now}
  }
});

var Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;