mongoose = require("mongoose");
const Objectid = mongoose.Schema.Types.ObjectId;
const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    image: {
      type: Array,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    categoryId: {
      type: Objectid,
      ref: "categories",
    },
    isCategoryBlocked: {
      type: Boolean,
    },
    quantity: {
      type: Number,
    },
<<<<<<< HEAD
    rating:{
      type:Number,
      default:5
    }
=======
>>>>>>> 012eb61beef60129d4b4ed8b9e6759c14b1ed50b
  },
  {
    timestamps: true,
  }
);

const productModel = new mongoose.model("products", productSchema);
module.exports = productModel;
