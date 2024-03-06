const adminModal = require("../models/adminModel");
const { categorySchema, productSchema } = require("../helpers/valiadator");
const productModel = require("../models/productModel");
const categoryModel = require("../models/categoryModel");
const userModel=require('../models/userModel');




const adminLoginLoader = async (req, res) => {
  try {
    res.render("adminlogin");
  } catch (error) {
    console.log(error.message);
  }
};

const verifyAdminLogin = async (req, res) => {
  try {
    const adminDb = await adminModal.findOne({});
    const adminPassword = adminDb.password;
    const inputPassword = req.body.password;
    if (adminPassword == inputPassword) {
      req.session.admin = adminDb;
      res.json(true);
    } else {
      res.json(false);
    }
  } catch (error) {
    console.log(error.message);
  }
};

// pageloaders here

const adminHomeLoader = async (req, res) => {
  try {
    res.render("adminhome");
  } catch (error) {
    console.log(error);
  }
};

const addProductsLoader = async (req, res) => {
  try {
    const category = await categoryModel.find({});
    res.render("addproduct", { category });
  } catch (error) {
    console.log(error.message);
  }
};

const categoriesLoader = async (req, res) => {
  try {
    res.render("categories");
  } catch (error) {
    console.log(error.message);
  }
};

const ordersLoader = async (req, res) => {
  try {
    res.render("orders");
  } catch (error) {
    console.log(error.message);
  }
};

const reviewsLoader = async (req, res) => {
  try {
    res.render("reviews");
  } catch (error) {
    console.log(error.message);
  }
};

const transactionsLoader = async (req, res) => {
  try {
    res.render("transaction");
  } catch (error) {
    console.log(error.message);
  }
};

// add product post request handling

const addProductDb = async (req, res) => {
  try {
    // validation
    console.log(req.body);
    console.log(req.files);
    const {
      price,
      cost,
      color,
      size,
      brand,
      description,
      productname,
      status,
    } = req.body;

    const imagePaths = req.files.map((i) => i.filename);
    const validation = await productSchema.validateAsync(req.body);
    if (imagePaths.length < 1) {
      return res.json("emptyfiles");
    } else if (Number(price) < Number(cost)) {
      return res.json("lowprice");
    } else if (imagePaths.length < 4) {
      return res.json("less");
    }

    // storing in db
    const productData = new productModel({
      productName: productname,
      price: price,
      cost: cost,
      size: size,
      brand: brand,
      description: description,
      color: color,
      status: status,
      image: imagePaths,
    });
    await productData.save();
    res.json(true);
  } catch (error) {
    res.json(error.message);
  }
};

// category section
const loadAddCategory = async (req, res) => {
  try {
    const categories = await categoryModel.find({});
    res.render("categories", { categories });
  } catch (error) {
    console.log(error.message);
  }
};
const addCategoryDb = async (req, res) => {
  try {
    console.log("addcat", req.body);
    const validation = await categorySchema.validateAsync(req.body);
    const existingcategory = await categoryModel.find({
      categoryname: req.body.categoryname,
    });
    if (existingcategory.length > 0) {
      return res.json(false);
    }
    const categoryData = new categoryModel({
      categoryName: req.body.categoryname,
      status: req.body.status,
      description: req.body.description,
    });
    const data = await categoryData.save();
    res.json(true);
  } catch (error) {
    res.json(error.message);
    console.log("fgfgfg", error.message);
  }
};

const editcategoryDb = async (req, res) => {
  try {
    await categorySchema.validateAsync(req.body);
    const categoryid = req.params.id;
    console.log(req.body);
    const { categoryName, description, status } = req.body;
    await categoryModel.updateOne(
      { _id: categoryid },
      {
        $set: {
          categoryName: categoryName,
          description: description,
          status: status,
        },
      }
    );
    res.json(true);
  } catch (error) {
    res.json(error.message);
  }
};

// product dashboard admin

const productsLoader = async (req, res) => {
  try {
    const productData = await productModel.find({});
    const category = await categoryModel.find({});
    res.render("products", { productData, category });
  } catch (error) {
    console.log(error.message);
  }
};

// edit

const editProduct = async (req, res) => {
  try {
    console.log("edit product", req.params);
    const productId = req.params.id;
    const category = await categoryModel.find({});
    const productData = await productModel.findOne({ _id: productId });
    res.render("editproduct", { productData, category });
  } catch (error) {
    console.log(error.message);
  }
};

const editProductDb = async (req, res) => {
  try {
    const {
      price,
      cost,
      description,
      brand,
      status,
      productname,
      color,
      size,
    } = req.body;
    const productId = req.params.id;
    const imagePath = req.files.map((i) => i.filename);
    await productSchema.validateAsync(req.body);
    await productModel.updateOne(
      { _id: productId },
      {
        $set: {
          productName: productname,
          price: price,
          cost: cost,
          description: description,
          brand: brand,
          status: status,
          color: color,
          size: size,
          image: imagePath,
        },
      }
    );
    res.json(true);
  } catch (error) {
    res.json(error.message);
  }
};

const userLoader = async (req, res) => {
  try {
    const 
    res.render('users')
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  adminLoginLoader,
  verifyAdminLogin,
  adminHomeLoader,
  addProductsLoader,
  productsLoader,
  categoriesLoader,
  transactionsLoader,
  reviewsLoader,
  ordersLoader,
  addProductDb,
  loadAddCategory,
  addCategoryDb,
  editProduct,
  editProductDb,
  editcategoryDb,
};
