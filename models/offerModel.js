const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  discountpercentage: {
    type: Number,
    required: true,
  },

  status:{
    type: String,
    default:false
  },
  expirydate:{
    type: Date,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  category:{
    type:String,
    ref:'category',
    required:true
  },
  image:{
    type:String,
    required:true
  }
},
{
    timestamps:true
}
);


const offerModel = mongoose.model("offerModel", offerSchema);
module.exports = offerModel