const {
  signupSchema,
  signinSchema,
  addressSchema,
  editProfileSchema,
} = require("../helpers/valiadator");
const User = require("../models/userModel");
const { hashPassword, comparePasswords } = require("../middleware/bcrypt");
const Address = require("../models/addressModel");
const { isLogin, isLogout } = require("../middleware/auth");
const productModel = require("../models/productModel");
const addressModel = require("../models/addressModel");

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
    const userId = req.session.user._id;
    const { type, name, addressline, city, state, zipcode, country, mobileno } =
      req.body;
    const existingAddress = await Address.findOne({ _id: userId, type: type });
    console.log("existinggggggggggggggggggggg", existingAddress);
    if (Boolean(existingAddress)) {
      return res.json("There is an existing address ");
    }
    const validation = await addressSchema.validateAsync(req.body);
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
    res.json(error.message);
    console.log(error.message);
  }
};

const changePasswordDb = async (req, res) => {
  try {
    const userDb = await User.findById(req.session.user._id);
    const oldpassword = req.body.oldpassword;
    const dbpassword = userDb.password;
    const newpassword = req.body.confirmnewpassword;
    console.log("edit password", req.body);
    const validpassword = await comparePasswords(oldpassword, dbpassword);
    // const hashednewpassword = await hashPassword(newpassword);
    console.log(validpassword);
    if (validpassword) {
      await User.updateOne(
        { _id: req.session.user._id },
        { $set: { password: await hashPassword(newpassword) } }
      );
      res.json("success");
    } else {
      res.json("failture");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const editProfileHandler = async (req, res) => {
  try {
    console.log(req.body);
    const { name, gender, email, mobileno } = req.body;
    const userId = req.session.user._id;
    const existUser = await User.findOne({ email: email });
    if (existUser) {
      return res.json("Email is already taken");
    }
    const validation = await editProfileSchema.validateAsync(req.body);
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
    res.json(error.message);
  }
};

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
};
