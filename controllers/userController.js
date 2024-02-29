const {
  signupSchema,
  signinSchema,
  addressSchema,
} = require("../helpers/valiadator");
const User = require("../models/userModel");
const { hashPassword, comparePasswords } = require("../middleware/bcrypt");
const Address = require("../models/addressModel");
const { isLogin, isLogout } = require("../middleware/auth");
const productModel = require("../models/productModel");

const loadHomepage = async (req, res) => {
  try {
    res.render("index");
  } catch (error) {
    console.log(error);
  }
};

const loadloginpage = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error);
  }
};

const logoutFn = async (req, res) => {
  try {
    req.session.user = null;
    res.redirect("/");
  } catch (error) {
    console.log(error.message);
  }
};

const loadRegisterpage = async (req, res) => {
  try {
    res.render("register");
  } catch (error) {
    console.log(error.message);
  }
};

const signupDb = async (req, res, next) => {
  try {
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
    if (validuser && userDb) {
      req.session.user = userDb;
      res.json(true);
    } else {
      res.json(false);
    }

    console.log(req.session);
  } catch (error) {
    message = error.message;
    return res.json("Invalid user");
  }
};

const productDetailsLoad = async (req, res) => {
  try {
    const productid = req.params.id;
    const productData = await productModel.findOne({});
    res.render("productdetail", { productData });
  } catch (error) {
    console.log(error);
  }
};

const shopLoader = async (req, res) => {
  try {
    const productData = await productModel.find({});
    res.render("shop", { productData });
  } catch (error) {
    console.log(error.message);
  }
};

// addaddress

const addAddressDb = async (req, res) => {
  try {
    console.log(req.body);
    console.log(Object.keys(req.body));
    const { type, name, addressline, city, state, zip, country, mobileno } =
      req.body;
    const existingAddress = await Address.find({ type: type });
    if (existingAddress) {
      return res.json("There is an existing address ");
    }
    const validation = await addressSchema.validateAsync(req.body);
    const addressData = await new Address(req.body);
    await addressData.save();
    console.log(validation);
    res.json(true);
  } catch (error) {
    res.json(error.message);
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
};
