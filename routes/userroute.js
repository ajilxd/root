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
userRoute.post(
  "/cart/quantitychange/:id",
  isLogin,
  cartController.quantityUpdate
);
userRoute.post("/cart/removecart/:id", isLogin, cartController.removeFromCart);
userRoute.get("/cart/checkout", isLogin, cartController.checkOutLoader);
userRoute.post("/cart/placeorder/", cartController.placeorderdb);
userRoute.get("/cart/orderconfirm/", cartController.orderconfirmloader);

userRoute.post("/changepassword", userController.changePasswordDb);
userRoute.post("/editprofile", userController.editProfileHandler);
userRoute.post("/editAddress/:id", userController.editAddresshandler);
module.exports = userRoute;
