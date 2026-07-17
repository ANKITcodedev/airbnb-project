// //core modules
// const fs = require("fs");
// const path = require("path");
// const rootDir = require("../utils/pathUtil");
// const db = require("../utils/databaseUtil");

// const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
// const { getDb } = require("../utils/databaseUtil");

// const homeDataPath = path.join(rootDir, "data", "homes.json");

const homeSchema = mongoose.Schema({
  houseName: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  photo: String,
  description: String,
});

// homeSchema.pre('findOneAndDelete', async function() {
//   const homeId = this.getQuery()._id;
//   await favourite.deleteMany({houseId: homeId});
// });

module.exports = mongoose.model('Home', homeSchema);
