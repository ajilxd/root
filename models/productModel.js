mongoose = require("mongoose");
const Objectid = mongoose.Schema.Types.ObjectId;
const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    unique:true
  },
  price: {
    type: Number,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  size:{
    type: String,
    required:true
  },
  brand:{
    type: String,
    required:true
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
},{
    timestamps:true
});

const productModel = new mongoose.model("products", productSchema);
module.exports = productModel;
