const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  discountPercentage: {
    type: Number,
  },

  Status:{
    type: Boolean,
    default:false
  },
  expiryDate:{
    type: Date,
    required:true
  }
},
{
    timestamps:true
}
);


const offerModel = mongoose.model("offerModel", offerSchema);
module.exports = offerModel