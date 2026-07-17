// //core modules
// const path = require("path");
console.log("STORE ROUTER LOADED");
// external module
const express = require("express");
const storeRouter = express.Router();

// local module
// const rootDir = require("../utils/pathUtil");
// const { registeredHomes } = require("./hostRouter");
const storeController = require("../controllers/storeController");

storeRouter.get("/", storeController.getIndex);
storeRouter.get("/bookings", storeController.getBookings);
storeRouter.get("/homes", storeController.getHomes);
storeRouter.get("/favourites", storeController.getFavouriteList);

storeRouter.get("/homes/:homeId", storeController.getHomeDetails);
storeRouter.post("/favourites", storeController.postAddToFavourite);
storeRouter.post("/favourites/delete/:homeId", storeController.postDeleteFromFavourite);


module.exports = storeRouter;