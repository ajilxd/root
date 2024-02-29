const cartModel = require("../models/cartModel");
const productModel = require("../models/productModel");
const userModel = require("../models/userModel");
const cartLoader = async (req, res) => {
  try {
    const cartData = await cartModel
      .find({ userId: req.session.user._id })
      .populate("productId");
    console.log(cartData);
    res.render("cart.ejs", { cartData });
  } catch (error) {
    console.log(error.message);
  }
};

const addToCart = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.json("nosession");
    }
    const productData = await productModel.findOne({ _id: req.params.id });
    console.log(productData);
    if (true) {
      const Cartdb = new cartModel({
        productId: req.params.id,
        userId: req.session.user._id,
        productname: productData.productName,
        quantity: 1,
        price: productData.price,
        productimage: productData._id,
        totals: productData.price,
      });

      await Cartdb.save();
    }
    console.log(req.params);
    console.log(req.session.user);
    res.json(true);
  } catch (error) {
    console.log(error.message);
  }
};

const quantityUpdate = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const cartId = req.params.id;
    console.log(cartId);
    const cartData = await cartModel.findOne({ _id: cartId });
    const dbQuantity = cartData.quantity;
    console.log(dbQuantity);
    console.log(cartData);
    const Chngquantity = Number(req.body.quantity);
    const totalsum = dbQuantity * cartData.price;
    console.log("totalsum", totalsum);
    await cartModel.updateOne(
      { _id: cartId },
      { $set: { quantity: dbQuantity + Chngquantity, totals: totalsum } }
    );
    const cartDat = await cartModel.findOne({ _id: cartId });
    console.log(cartDat);
    const cartDocs = await cartModel.find({});
    const sumOfAllProducts = cartDocs.reduce(
      (total, cart) => total + cart.totals,
      0
    );
    await userModel.updateOne(
      { _id: userId },
      { $set: { totalcart: sumOfAllProducts } }
    );
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { cartLoader, addToCart, quantityUpdate };
