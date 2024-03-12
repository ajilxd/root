const reviewModel = require("../models/reviewModel");
const userModel = require("../models/reviewModel");
const productModel = require("../models/productModel");
const { reviewValidationSchema } = require("../helpers/valiadator");

const getAllReviews = async (req, res) => {
  try {
    const reviewsData = await reviewModel.find({});
  } catch (error) {
    console.log(error.message);
  }
};

const CreateReview = async (req, res) => {
  try {
    console.log("create view", req.body);
    const userId = req.session.user._id;
    const productId = req.params.id;
    const rating = req.body.rating;
    const review = req.body.message;
<<<<<<< HEAD
    
=======
>>>>>>> 012eb61beef60129d4b4ed8b9e6759c14b1ed50b
    console.log(
      "create review section here",
      userId,
      productId,
      rating,
      review
    );
    // validation
    // checking whether user already wrote an review or not

    const alreadyReviewed = await reviewModel.findOne({
      userId: userId,
      productId: productId,
    });
<<<<<<< HEAD
    // console.log(alreadyReviewed);
    // if (alreadyReviewed) {
    //   return res.json("User already reviewed");
    // }
=======
    console.log(alreadyReviewed);
    if (alreadyReviewed) {
      return res.json("User already reviewed");
    }
>>>>>>> 012eb61beef60129d4b4ed8b9e6759c14b1ed50b
    console.log(Boolean(review));
    if (!review) {
      return res.json("Review cant be submitted with null ");
    }

    // db
    const newreview = new reviewModel({
      rating: rating,
      review: review,
      userId: userId,
      productId: productId,
    });
    await newreview.save();
<<<<<<< HEAD
    // console.log("heyyyyyyyyyy");
    // console.log(newreview);
    // update rating of product
    const productReviews =await reviewModel.find({productId:productId})
    console.log(productReviews);
    let totalRatings=0;
    for(const review of productReviews){
      totalRatings=totalRatings+Number(rating);
    }
    const avgRating =Math.floor(totalRatings/productReviews.length)
    console.log(avgRating);
    console.log('total ratingssssssssssssssssssssssssssssssssssss',totalRatings);
    // update rating to the product
    await productModel.updateOne({_id:productId},{$set:{rating:avgRating}});
=======
    console.log("heyyyyyyyyyy");
    console.log(newreview);
    // update rating of product
    const totalReviewDatas = await reviewModel({ productId: productId });
    const sumOfAllRatings = totalReviewDatas.reduce(
      (total, datas) => total + datas.rating,
      0
    );
    console.log(sumOfAllRatings, "sum of all rating here...");
    await productModel({ _id: productId });
    res.json(true);
>>>>>>> 012eb61beef60129d4b4ed8b9e6759c14b1ed50b
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  getAllReviews,
  CreateReview,
};
