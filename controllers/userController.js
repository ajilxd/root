const {
  signupSchema,
  signinSchema,
  addressSchema,
  editProfileSchema,
  editPasswordSchema,
  changePasswordSchema,
} = require("../helpers/valiadator");
const User = require("../models/userModel");
const { hashPassword, comparePasswords } = require("../middleware/bcrypt");
const Address = require("../models/addressModel");
const { isLogin, isLogout } = require("../middleware/auth");
const productModel = require("../models/productModel");
const addressModel = require("../models/addressModel");
const userModal = require("../models/userModel");
const { sendOtp } = require("../middleware/nodemailer");
const reviewModel = require("../models/reviewModel");
const requestModel = require("../models/userRequestsModel");
const wishlistModel = require("../models/wishlistModel");
const categoryModel = require("../models/categoryModel");
const notificationModel =require("../models/notificationModel")


const loadHomepage = async (req, res) => {
  try {
    const userData = await userModal.find({ _id: req.session?.user?._id });
    res.render("index", { userData });
  } catch (error) {
    console.log(error);
  }
};

const loadloginpage = async (req, res) => {
  try {
    const userData = await userModal.find({ _id: req.session?.user?._id });
    res.render("login", { userData });
  } catch (error) {
    console.log(error);
  }
};

const logoutFn = async (req, res) => {
  try {
    req.session.user = null;
    res.json(true);
  } catch (error) {
    console.log(error.message);
  }
};

const loadRegisterpage = async (req, res) => {
  try {
    const userData = await userModal.find({ _id: req.session?.user?._id });
    res.render("register", { userData });
  } catch (error) {
    console.log(error.message);
  }
};

const signupDb = async (req, res, next) => {
  try {
    console.log("req.body", req.body);
    const validation = await signupSchema.validateAsync(req.body);
    const existUser = await User.findOne({ email: req.body.email });
    if (existUser) {
      return res.json("Email is already taken");
    }
  } catch (error) {
    message = error.message;
    return res.json(message);
  }

  req.session.user = req.body;
  console.log(req.session);
  const userdata = await new User({
    name: req.body.username,
    email: req.body.email,
    password: await hashPassword(req.body.password),
    isVerified:false
  });
  await userdata.save();
  res.json(true);
  next();
};

const verifylogin = async (req, res) => {
  try {
    console.log(req.body);
    const validation = await signinSchema.validateAsync(req.body);
    const { email, password } = req.body;
    const userDb = await User.findOne({ email: email });
    const validuser = await comparePasswords(password, userDb.password);
    if(userDb.isVerified){
    if (userDb.isBlocked) {
      return res.json("You are banned...!");
    }
    if (validuser && userDb) {
      req.session.user = userDb;
      res.json(true);
    } else {
      res.json(false);
    }
  }else{
    await User.deleteOne({email:email});
  }
    
  } catch (error) {
    message = error.message;
    return res.json("Invalid user");
  }
};

const productDetailsLoad = async (req, res) => {
  try {
    const userData = await userModal.find({
      _id: req.session?.user?._id,
    });
    const productid = req.params.id;
    const reviewData = await reviewModel
      .find({ productId: productid })
      .populate("userId");
   
    console.log("reviewsssssssssssssssssss", reviewData);
    const productData = await productModel.findOne({ _id: productid });
    console.log(productData, userData);
    res.render("productdetail", { productData, userData, reviewData });
  } catch (error) {
    console.log(error.message);
  }
};

const shopLoader = async (req, res) => {
  try {
    const userData = await userModal.find({ _id: req.session?.user?._id });
    const productData = await productModel.find({});
    const catData = await categoryModel.find({});
    catname = false;
    res.render("shop", { productData, userData, catData, catname });
  } catch (error) {
    console.log(error.message);
  }
};

const categoryRenderer = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const categoryData = await categoryModel.findOne({ _id: categoryId });
    const userData = await userModal.find({ _id: req.session?.user?._id });
    const productData = await productModel.find({ categoryId: categoryId });
    const catData = await categoryModel.find({});
    res.render("shop", {
      productData,
      userData,
      catData,
      catname: categoryData.categoryName,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const sortAscendingName = async (req, res) => {
  try {
    const productData = await productModel.aggregate([
      {
        $sort: { productName: 1 }, // Sort by price in descending order
      },
    ]);
    const catData = await categoryModel.find({});
    const userData = await userModal.find({ _id: req.session?.user?._id });
    const catname = false;
    res.render("shop", {
      productData,
      userData,
      catData,
      catname: catname,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const sortDescendingName = async (req, res) => {
  try {
    const productData = await productModel.aggregate([
      {
        $sort: { productName: -1 }, // Sort by price in descending order
      },
    ]);
    const catData = await categoryModel.find({});

    const userData = await userModal.find({ _id:  req.session?.user?._id  });

    const catname = false;
    res.render("shop", {
      productData,
      userData,
      catData,
      catname: catname,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const topRatedProducts = async (req, res) => {
  try {
    const productData = await productModel.aggregate([
      {
        $sort: { rating: -1 }, 
      },
    ]);
    const catData = await categoryModel.find({});
    const userData = await userModal.find({ _id: req.session?.user?._id });
    const catname = 'Top rated';
    res.render("shop", {
      productData,
      userData,
      catData,
      catname: catname,
    });
  } catch (error) {
    console.log(error.message);
  }
};


// notification

const notificationLoader = async (req, res) => {
  try {
    const userid =req.session.user._id;
    const userData = await userModal.find({ _id: req.session?.user?._id });
    const notifiData =await notificationModel.findOne({userId:userid});
    // console.log('gggcgcgcgchch',notifiData)
    const catname = 'Notifications';
    res.render("notification", {
     notifiData,userData, catname: catname,
    });
  } catch (error) {
    console.log(error.message);
  }
};




// adding new address

const addAddressDb = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const { type, name, addressline, city, state, zipcode, country, mobileno } =
      req.body;
    const existingAddress = await Address.findOne({ _id: userId, type: type });
    if (Boolean(existingAddress)) {
      return res.json("There is an existing address ");
    }
    try {
      const validation = await addressSchema.validateAsync(req.body);
    } catch (error) {
      return res.json(error.message);
    }

    const addressData = await new Address({
      type: type,
      name: name,
      addressline: addressline,
      city: city,
      state: state,
      zipcode: zipcode,
      country: country,
      mobileno: mobileno,
      userId: userId,
    });
    await addressData.save();
    res.json(true);
  } catch (error) {
    console.log(error.message);
  }
};

// changing password

const changePasswordDb = async (req, res) => {
  try {
    const userDb = await User.findById(req.session.user._id);
    const oldpassword = req.body.oldpassword;
    const dbpassword = userDb.password;
    const newpassword = req.body.confirmnewpassword;

    try {
      await editPasswordSchema.validateAsync(req.body); //validation joi
    } catch (error) {
      return res.json(error.message);
    }

    const validpassword = await comparePasswords(oldpassword, dbpassword); //comparing database passowrd and input passowrd
    if (!validpassword) return res.json("wrong old password");

    if (validpassword) {
      await User.updateOne(
        { _id: req.session.user._id },
        { $set: { password: await hashPassword(newpassword) } }
      );
      res.json("success");
    }
  } catch (error) {
    console.log(error.message);
  }
};

// editing user profile

const editProfileHandler = async (req, res) => {
  try {
    console.log("edit profile session", req.session.user);
    const { name, gender, email, mobileno } = req.body;

    const userId = req.session.user._id;
    const existUser = await User.findOne({ email: email });
    if (existUser) {
      return res.json("Email is already taken"); //checking whether the email is taken or not
    }
    try {
      await editProfileSchema.validateAsync(req.body);
    } catch (error) {
      return res.json(error.message); //validation error
    }

    await User.updateOne(
      { _id: userId },
      {
        $set: {
          name: name,
          gender: gender,
          email: email,
          mobilenumber: mobileno,
        },
      }
    );
    res.json(true);
  } catch (error) {
    console.log(error.message); //uncaught errors here
  }
};

// edit address handling
const editAddresshandler = async (req, res) => {
  try {
    console.log(req.body);
    const addressId = req.params.id;

    const { formData } = req.body;
    const validation = await addressSchema.validateAsync(formData);
    const { name, addressline, city, state, zipcode, country, mobileno, type } =
      formData;
    await addressModel.updateOne(
      { userId: req.session.user._id },
      {
        $set: {
          type: type,
          name: name,
          addressline,
          city: city,
          state: state,
          zipcode: zipcode,
          country: country,
          mobileno: mobileno,
        },
      }
    );
    res.json(true);
  } catch (error) {
    res.json(error.message);
    console.log(error.message);
  }
};

const forgetpasswordloader = async (req, res) => {
  try {
    res.render("forgetpassword");
  } catch (error) {
    console.log(error.message);
  }
};

const forgetpasswordhandler = async (req, res) => {
  try {
    const email = req.body.email;
    const existingemail = await userModal.findOne({ email: email });
    if (existingemail) {
      await sendOtp(email);
      req.session.forgetemail = email;
      res.json(true);
    } else {
      res.json(false);
    }
  } catch (error) {
    console.log(error.message);
  }
};

const updatepasswordloader = async (req, res) => {
  try {
    res.render("forgetpasswordupdate");
  } catch (error) {
    console.log(error.message);
  }
};

const updatepassworddb = async (req, res) => {
  try {
    console.log("session at update password", req.session);
    const email = req.session.forgetemail;
    const password = req.body.password;

    // Validation
    try {
      await changePasswordSchema.validateAsync(req.body);
    } catch (error) {
      return res.json(error.message);
    }

    // Hashing password and updating database
    const hashedPassword = await hashPassword(password);
    await userModal.updateOne(
      { email: email },
      { $set: { password: hashedPassword } }
    );

    res.json(true);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const cancelOrder = async (req, res) => {
  try {
    console.log(req.body);
    const reason = req.body.reason;
    const orderid = req.body.orderId;
    const userid = req.session.user._id;
    if (reason && orderid && userid) {
      console.log("data received");
    }
    const cancelData = new requestModel({
      isCancel: true,
      message: reason,
      userId: userid,
      orderId: orderid,
    });
    await cancelData.save();
    res.json(true);
  } catch (error) {
    console.log(error.message);
  }
};

const returnOrder = async (req, res) => {
  try {
    console.log(req.body);
    const reason = req.body.reason;
    const orderid = req.body.orderId;
    const userid = req.session.user._id;
    if (reason && orderid && userid) {
      console.log("data received");
    }
    const returnData = new requestModel({
      isReturn: true,
      message: reason,
      userId: userid,
      orderId: orderid,
    });
    await returnData.save();
    res.json(true);
  } catch (error) {
    console.log(error.message);
  }
};

const addtowishlisthandler = async (req, res) => {
  try {
    const { productid } = req.body;
    if (!req.session.user) {
      console.log("nosession");
      return res.json("nosession");
    }
    const userId = req.session.user._id;
    const productObj = await productModel.findOne({ _id: productid });
    await wishlistModel.updateOne(
      { userId: userId },
      {
        $addToSet: {
          product: productid,
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

const wishlistloader = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const userData = await User.findOne({ _id: userId });
    console.log(req.session.user, "SESSION AT WISHLIST");
    const data = await wishlistModel
      .findOne({ userId: req.session.user._id })
      .populate("product");
    console.log("WISHLIST", data);
    res.render("wishlist", { wishlistData: data, userData });
  } catch (error) {
    console.log(error.message);
  }
};

const removefromWishlist = async (req, res) => {
  try {
    console.log(req.body);
    const productId = req.body.productid;
    await wishlistModel.updateOne(
      { userId: req.session.user._id },
      { $pull: { product: productId } }
    );
    res.json(true);
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  loadHomepage,
  loadloginpage,
  loadRegisterpage,
  signupDb,
  verifylogin,
  productDetailsLoad,
  shopLoader,
  addAddressDb,
  logoutFn,
  changePasswordDb,
  editProfileHandler,
  editAddresshandler,
  forgetpasswordloader,
  forgetpasswordhandler,
  updatepasswordloader,
  updatepassworddb,
  cancelOrder,
  returnOrder,
  addtowishlisthandler,
  wishlistloader,
  removefromWishlist,
  categoryRenderer,
  sortAscendingName,
  sortDescendingName,
  topRatedProducts,
  notificationLoader
};
