const { Schema , model} = require("mongoose");

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  author: {
    type: String,
    required: true,
  },

  subject: {
    type: String,
    required: true,
  },

  publishDate: {
    type: Date,
  },
});

module.exports = model("Book", bookSchema);
