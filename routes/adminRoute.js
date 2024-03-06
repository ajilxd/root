const express = require("express");
const adminRoute = express();
const path = require("path");
const adminController = require("../controllers/adminController");
const upload = require("../middleware/multer");
const { isAdminLogin, isAdminLogout } = require("../middleware/auth");
adminRoute.set("views", "./views/admin");
adminRoute.use(
  "/admin/editproduct/assets",
  express.static(path.join(__dirname, "../assets"))
);
adminRoute.get("/login", adminController.adminLoginLoader);
adminRoute.post("/login", adminController.verifyAdminLogin);
adminRoute.get("/home", isAdminLogin, adminController.adminHomeLoader);

adminRoute.get("/addproduct", isAdminLogin, adminController.addProductsLoader);
adminRoute.get("/products", isAdminLogin, adminController.productsLoader);

adminRoute.post(
  "/addproduct",
  upload.array("files", 4),
  adminController.addProductDb
);

adminRoute.get("/category", isAdminLogin, adminController.loadAddCategory);
adminRoute.post("/addcategory", isAdminLogin, adminController.addCategoryDb);
adminRoute.get("/editproduct/:id", isAdminLogin, adminController.editProduct);
adminRoute.post(
  "/editproduct/:id",
  isAdminLogin,
  upload.array("files", 4),
  adminController.editProductDb
);
adminRoute.post("/editcategory/:id", adminController.editcategoryDb);

adminRoute.get("/reviews", adminController.reviewsLoader);

// logout
adminRoute.get("/logout", isAdminLogout);

module.exports = adminRoute;
