const mongoose = require("mongoose");

const connectDb = (URI) => mongoose.connect(URI);

module.exports = connectDb;
