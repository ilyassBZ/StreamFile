const mongoose = require("mongoose");

const fileSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  data: {
    type: Array,
  },
});

module.exports = mongoose.model("File", fileSchema);
