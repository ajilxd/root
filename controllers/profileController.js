const orderModel = require("../models/orderModel");
const userModel = require("../models/userModel");
const addressModel = require("../models/addressModel");

const profileLoader = async (req, res) => {
  try {
    const orderData = await orderModel.find({ userId: req.session.user._id });

    const addressData = await addressModel.find({
      userId: req.session.user._id,
    });
    const userData = await userModel.findOne({ _id: req.session.user._id });
    console.log(userData);
    res.render("userprofile", {
      orderData: orderData,
      addressData,
      userData,
    });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { profileLoader };
