const express = require("express");
const userRoute = express();
const userController = require("../controllers/userController");
const otpController = require("../controllers/otpController");
const otpGenerator = require("../middleware/otpgenerator");
const { isLogin, isLogout } = require("../middleware/auth");
const cartController = require("../controllers/cartcontroller");

userRoute.get("/", userController.loadHomepage);
userRoute.get("/login", isLogout, userController.loadloginpage);
userRoute.get("/register", userController.loadRegisterpage);
userRoute.post("/register", userController.signupDb, otpController.sendOtpMail);
userRoute.post("/login", userController.verifylogin);
userRoute.get("/productdetail/:id", userController.productDetailsLoad);
userRoute.get("/shop", userController.shopLoader);
userRoute.post("/addaddress", userController.addAddressDb);
userRoute.get("/logout", userController.logoutFn);

userRoute.get("/cart", isLogin, cartController.cartLoader);
userRoute.get("/addtocart/:id", cartController.addToCart);
userRoute.post("/cart/quantitychange/:id", cartController.quantityUpdate);
module.exports = userRoute;
