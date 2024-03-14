const addressModel = require("../models/addressModel");
const cartModel = require("../models/cartModel");
const productModel = require("../models/productModel");
const userModel = require("../models/userModel");
const orderModel = require("../models/orderModel");
const cartLoader = async (req, res) => {
  try {
    const userData = await userModel.find({ email: req.session?.user?.email });
    const cartData = await cartModel
      .find({ userId: req.session.user._id })
      .populate("productId");
    console.log(cartData);
    res.render("cart.ejs", { cartData, userData });
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
        image: productData.image[0],
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

// addtocart from product details

const addtocartProductDetailsHandler = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.params);
    const productId = req.params.id;
    const quantity = req.body.quantity;
    const userId = req.session.user._id;
    // stock management
    const pData = await productModel.findOne({ _id: productId });
    const maxstock = pData.quantity;
    if (quantity > maxstock) {
      return res.json("nostock");
    }
    if (!req.session.user) {
      return res.json("nosession");
    }
    const productData = await productModel.findOne({ _id: productId });
    console.log(productData);
    if (true) {
      const Cartdb = new cartModel({
        productId: productId,
        userId: userId,
        productname: productData.productName,
        quantity: quantity,
        price: productData.price,
        productimage: productData._id,
        totals: productData.price * quantity,
        image: productData.image[0],
      });

      await Cartdb.save();
    }
    console.log("product added succesfully added to cart");
    res.json(true);
  } catch (error) {
    console.log(error.message);
  }
};

const quantityUpdate = async (req, res) => {
  try {
    console.log("quantity update here", req.body);
    const userId = req.session.user._id;
    const cartId = req.params.id;
    console.log(cartId);
    const cartData = await cartModel.findOne({ _id: cartId });
    const Chngquantity = Number(req.body.quantity);

    // stock management
    const productData = await productModel.findOne({ _id: cartData.productId });
    const maxstock = productData.quantity;
    if (Chngquantity > maxstock) {
      return res.json("nostock");
    }
    const totalsum = Chngquantity * cartData.price;
    console.log("totalsum", totalsum);
    await cartModel.updateOne(
      { _id: cartId },
      { $set: { quantity: Chngquantity, totals: totalsum } }
    );
    const cartDat = await cartModel.findOne({ _id: cartId });
    const cartDocs = await cartModel.find({});
    const sumOfAllProducts = cartDocs.reduce(
      (total, cart) => total + cart.totals,
      0
    );
    console.log(sumOfAllProducts);
    await userModel.updateOne(
      { _id: userId },
      { $set: { totalcart: sumOfAllProducts } }
    );
    res.json(true);
  } catch (error) {
    console.log(error.message);
  }
};

const removeFromCart = async (req, res) => {
  try {
    console.log("removecart");
    const cartItemId = req.params.id;
    await cartModel.deleteOne({ _id: cartItemId });
    console.log("Product is removed from cart");
  } catch (error) {
    console.log(error.message);
  }
};

const checkOutLoader = async (req, res) => {
  try {
    const userData = await userModel.find({ email: req.session?.user?.email });
    const cartData = await cartModel
      .find({ userId: req.session.user._id })
      .populate("productId");
    // const userData = await userModel.findOne({ _id: req.session.user._id });
    const cartDocs = await cartModel.find({});
    const sumOfAllProducts = cartDocs.reduce(
      (total, cart) => total + cart.totals,
      0
    );
    console.log(sumOfAllProducts);
    const addressData = await addressModel.find({
      userId: req.session.user._id,
    });

    res.render("checkout", {
      cartData,
      addressData,
      userData,
      sumOfAllProducts
    });
  } catch (error) {
    console.log(error.message);
  }
};

const placeorderdb = async (req, res) => {
  try {
    console.log(req.body);
    const cartData = await cartModel.find({ userId: req.session.user._id });
    // stock management
    for (cartitem of cartData) {
      await productModel.updateOne(
        { _id: cartitem.productId },
        { $inc: { quantity: -cartitem.quantity } }
      );
    }
    // console.log(cartData);
    const orderid = String(Math.floor(Math.random() * 10000000000));
    const paymenttype = req.body.formData.paymenttype ? "COD" : null;
    const addressid = req.body.formData.addressId;
    const userId = req.session.user._id;
    let totalAmount = 0;
    cartData.forEach((i) => (totalAmount += i.totals));
    const orderData = new orderModel({
      userId: userId,
      deliveryAddress: addressid,
      payment: paymenttype,
      orderId: orderid,
      orderAmount: totalAmount,
      orderedItems: [...cartData],
    });
    await orderData.save();
    await cartModel.deleteMany({ userId: userId });
    await userModel.updateOne({ _id: userId }, { $set: { totalcart: 0 } });
    req.session.user.order = orderData;
    res.json(true);
  } catch (error) {
    console.log(error.message);
  }
};

const orderconfirmloader = async (req, res) => {
  try {
    const userData = await userModel.find({ email: req.session?.user?.email });
    console.log(req.session.user);
    const orderData = req.session.user.order;
    res.render("confirmation", { orderData, userData });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  placeorderdb,
  cartLoader,
  addToCart,
  quantityUpdate,
  removeFromCart,
  checkOutLoader,
  orderconfirmloader,
  addtocartProductDetailsHandler,
};
