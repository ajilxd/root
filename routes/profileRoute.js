const express = require("express");
const profileRoute = express();
const profileController = require("../controllers/profileController");
const { isLogin, isLogout } = require("../middleware/auth");

profileRoute.get("/", isLogin, profileController.profileLoader);

module.exports = profileRoute;
