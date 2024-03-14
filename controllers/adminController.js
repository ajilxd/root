const adminModal = require("../models/adminModel");
const { categorySchema, productSchema,couponSchema,offerSchema} = require("../helpers/valiadator");
const productModel = require("../models/productModel");
const categoryModel = require("../models/categoryModel");
const userModel = require("../models/userModel");
const orderModel = require("../models/orderModel");
const requestModel = require("../models/userRequestsModel");
const notificationModel = require("../models/notificationModel");
const reviewModel = require("../models/reviewModel");
const { request } = require("express");
const CouponModel = require("../models/couponModel");
const offerModel =require("../models/offerModel")
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
    const orderData = await orderModel.find({}).populate("userId");
    const cancelData = await requestModel
      .find({ isCancel: true })
      .populate("userId");
    const returnData = await requestModel
      .find({ isReturn: true })
      .populate("userId");
    res.render("orders", { orderData, cancelData, returnData });
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

    const {
      price,
      cost,
      color,
      size,
      brand,
      description,
      productname,
      status,
      categories,
      quantity,
    } = req.body;
    console.log("categoryyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy", categories);
    const imagePaths = req.files.map((i) => i.filename);
    console.log(req.body);
    try {
      await productSchema.validateAsync(req.body); //joi validation
    } catch (error) {
      console.log("hii error");
      console.log(error.message);
      return res.json(error.message);
    }
    const existingproduct = await productModel.findOne({
      productName: productname,
    });

    if (imagePaths.length < 1) {
      return res.json("emptyfiles");
    } else if (Number(price) < Number(cost)) {
      return res.json("lowprice");
    } else if (imagePaths.length < 4) {
      return res.json("less");
    } else if (existingproduct) {
      return res.json("Existing product name");
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
      categoryId: categories,
      quantity: quantity,
    });
    await productData.save();
    res.json(true);
  } catch (error) {
    console.log(error);
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
    try {
      await categorySchema.validateAsync(req.body);
    } catch (error) {
      res.json(error.message);
    }

    const existingcategory = await categoryModel.findOne({
      categoryName: req.body.categoryname,
    });
    if (existingcategory) {
      return res.json("existing category name");
    }
    const categoryData = new categoryModel({
      categoryName: req.body.categoryname,
      status: req.body.status,
      description: req.body.description,
    });
    const data = await categoryData.save();
    res.json(true);
  } catch (error) {
    console.log("error at add category", error.message);
  }
};

const editcategoryDb = async (req, res) => {
  try {
    const categoryid = req.params.id;
    console.log(req.body);
    const { categoryname, description, status } = req.body;

    try {
      await categorySchema.validateAsync(req.body);
    } catch (error) {
      return res.json(error.message);
    }

    const existingcategory = await categoryModel.findOne({
      categoryName: req.body.categoryname,
    });
    console.log(existingcategory);
    if (existingcategory) {
      return res.json("Existing category");
    }
    await categoryModel.updateOne(
      { _id: categoryid },
      {
        $set: {
          categoryName: categoryname,
          description: description,
          status: status,
        },
      }
    );
    res.json(true);
  } catch (error) {
    console.log(error.message);
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
    console.log("edit product");
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
    console.log(req.body);
    const {
      price,
      cost,
      description,
      brand,
      status,
      productname,
      color,
      size,
      categories,
      quantity,
    } = req.body;
    const productId = req.params.id;
    const imagePath = req.files.map((i) => i.filename);
    const existingproduct = await productModel.findOne({
      productName: productname,
    });
    if (existingproduct) {
      return res.json("existing productname");
    }
    try {
      await productSchema.validateAsync(req.body);
    } catch (error) {
      return res.json(error.message);
    }

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
          categoryId: categories,
          quantity: quantity,
        },
      }
    );
    res.json(true);
  } catch (error) {
    console.log(error.message);
  }
};

const userLoader = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.render("users", { users });
  } catch (error) {
    console.log(error.message);
  }
};

const blockUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const userData = await userModel.findByIdAndUpdate(
      { _id: userId },
      { $set: { isBlocked: true } }
    );
    console.log(`${userData.name} has been succesfully blocked`);
    res.json(true);
  } catch (error) {
    console.log("error at blocking user");
    console.log(error.message);
  }
};
const unblockUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const userData = await userModel.findByIdAndUpdate(
      { _id: userId },
      { $set: { isBlocked: false } }
    );
    console.log(`${userData.name} has been succesfully unblocked`);
    res.json(true);
  } catch (error) {
    console.log("error at unblocking user");
    console.log(error.message);
  }
};

const orderDetailsLoader = async (req, res) => {
  try {
    const orderId = req.params.id;
    const orderData = await orderModel
      .findOne({ orderId: orderId })
      .populate("userId")
      .populate("deliveryAddress");
    res.render("orderdetails", { orderData });
  } catch (error) {
    console.log(error.message);
  }
};

const orderStatusUpdate = async (req, res) => {
  try {
    console.log(req.body);
    const { selectedValue, orderId } = req.body;
    const orderData = await orderModel.updateOne(
      { orderId: orderId },
      { status: selectedValue }
    );
    console.log(orderData);
    res.json(true);
  } catch (error) {
    console.log(error.message);
  }
};

const logoutAdminhandler = async (req, res) => {
  try {
    req.session.admin = null;
    res.redirect("/admin/login");
  } catch (error) {
    console.log(error.message);
  }
};

const logOutAdmin = async (req, res) => {
  try {
    req.session.admin = null;
    res.json(true);
  } catch (error) {
    console.log(error.message);
  }
};

const cancelApprovedHandler = async (req, res) => {
  try {
    console.log(req.body);
    const { orderId, requestId, userId } = req.body;
    await orderModel.updateOne(
      { orderId: orderId },
      { $set: { status: "Cancelled" } }
    );
    await requestModel.deleteOne({ _id: requestId });
    await notificationModel.updateOne(
      { userId: userId },
      {
        $push: {
          messages: `#${orderId} has been successfully cancelled`,
        },
      },
      {
        upsert: true,
      }
    );

    res.json(true);
  } catch (error) {
    console.log(error.message);
  }
};

const cancelDiscardHandler = async (req, res) => {
  try {
    console.log(req.body);
    const { requestId } = req.body;
    await requestModel.deleteOne({ _id: requestId });
    res.json(true);
  } catch (error) {
    console.log(error.message);
  }
};

const returnApprovedHandler = async (req, res) => {
  try {
    console.log(req.body);
    const { orderId, requestId, userId } = req.body;
    await orderModel.updateOne(
      { orderId: orderId },
      { $set: { status: "Returned" } }
    );
    await requestModel.deleteOne({ _id: requestId });
    await notificationModel.updateOne(
      { userId: userId },
      {
        $push: {
          messages: `#${orderId} has been successfully approved for return`,
        },
      },
      {
        upsert: true,
      }
    );
    res.json(true);
  } catch (error) {
    console.log(error.message);
  }
};

const returnDiscardHandler = async (req, res) => {
  try {
    console.log(req.body);
    const { orderId, requestId } = req.body;
    await requestModel.deleteOne({ _id: requestId });
    res.json(true);
  } catch (error) {
    console.log(error.message);
  }
};

const loadReviews = async (req, res) => {
  try {
    const reviewData = await reviewModel
      .find({})
      .populate("userId")
      .populate("productId");
    console.log(reviewData);
    res.render("reviews", { reviewData });
  } catch (error) {
    console.log(error.message);
  }
};

const couponsLoader =async(req,res)=>{
  try{
    const allCoupons = await CouponModel.find({})
    res.render('coupons',{couponData:allCoupons})
  }catch(error){
    console.log(error.message)
  }
}

const addCoupon = async(req,res) =>{
  try{
    res.render('addcoupon')
  }catch(error){
    console.log(error.message)
  }
}

const addCouponDb = async(req,res)=>{
  try{
    const {name,code,status,limit,expiryDate,discountAmount, criteriaAmount}= req.body;
    try{ 
       await couponSchema.validateAsync(req.body);
    }catch(error){
       return res.json(error.message)
    }
    const couponData =  new CouponModel({
      name:name,
      code:code,
      status:status,
      limit:limit,
      expiryDate:expiryDate,
      discountAmount:discountAmount,
      criteriaAmount:criteriaAmount
    })
    
    await couponData.save();
   
    res.json(true);
  }catch(error){
    console.log(error.message)
  }
}

const editCouponLoader = async (req,res)=>{
  try{
    console.log(req.params);
    const couponId =req.params.id;
    const couponData =await CouponModel.findOne({_id:couponId})
    res.render('editcoupon',{couponData})
  }catch(error){
    console.log(error.message)
  }
}

const editCouponDb =async (req,res)=>{
  try{
    const couponId=req.params.id;
   
    const {name,code,status,limit,expiryDate,discountAmount, criteriaAmount}= req.body;
    // validation
   
    try{ 
       await couponSchema.validateAsync(req.body);
    }catch(error){
       return res.json(error.message)
    }
    
    await CouponModel.updateOne({_id:couponId},{$set:{
      name,code,status,limit,expiryDate,discountAmount,criteriaAmount
    }})
    res.json(true);
  }
  catch(error){
    console.log(error.message)
  }
}

const addofferload =async (req,res)=>{
  try{
    res.render('addoffers');
  }catch(error){
    console.log(error.message)
  }
}



const offerDb = async (req,res)=>{
  try{
   const {name,status,discountpercentage,expirydate,description,category} = req.body;
  //  validation
   try{
    await offerSchema.validateAsync(req.body);
   }
   catch(error){
   return res.json(error.message);
   }
  // checking offer name is taken or not
  const existing= await offerModel.findOne({name});
  if(existing){
    return res.json("Existing offer name");
  }
   const imagePath=req.file.filename;
   const offerData =new offerModel({
    name,status,discountpercentage,expirydate,description,category,image:imagePath
   })
   await offerData.save();
   res.json(true);
  }catch(error){
    console.log(error.message)
  }
}

const alloffersloader = async(req,res)=>{
  try{
    const offerData = await offerModel.find({});
    res.render('alloffers',{offerData})
  }catch(error){
    console.log(error.message)
  }
}

const editOffer = async(req,res)=>{
  try{
    const offerid =req.params.id;
    const offerdata= await offerModel.findOne({_id:offerid})
    res.render('editoffer',{offerdata});
  }catch(error){
    console.log(error.message)
  }
}


const editofferdb = async(req,res)=>{
  try{
    console.log(req.body);
    const {name,status,discountpercentage,expirydate,description,category,offerid} =req.body;
    //  validation
   try{
    await offerSchema.validateAsync(req.body);
   }
   catch(error){
   return res.json(error.message);
   }
  // checking offer name is taken or not
  const existing= await offerModel.findOne({name});
  if(existing){
    return res.json("Existing offer name");
  }
    await offerModel.updateOne({_id:offerid},{name,status,discountpercentage,expirydate,description,category});
    res.json(true);
  }catch(error){
    console.log(error);
  }
}

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
  userLoader,
  blockUser,
  unblockUser,
  orderDetailsLoader,
  orderStatusUpdate,
  logoutAdminhandler,
  logOutAdmin,
  cancelApprovedHandler,
  cancelDiscardHandler,
  returnApprovedHandler,
  returnDiscardHandler,
  loadReviews,
  couponsLoader,
  addCoupon,
  addCouponDb,
  editCouponLoader,
  editCouponDb,
  addofferload,
  offerDb ,
  alloffersloader,
  editOffer,
  editofferdb
};
