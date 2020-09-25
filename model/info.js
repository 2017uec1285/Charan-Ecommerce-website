const joi = require("joi");
const mongoose = require("mongoose");
const { productSchema } = require("./product");
const Info = mongoose.model(
  "Info",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 255,
    },
    product: {
      type: productSchema,
      required: true,
    },
    numberInStock: {
      type: Number,
      required: true,
      min: 0,
      max: 255,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      max: 255,
    },
  })
);
function validInfo(data) {
  const schema = {
    title: joi.string().min(2).max(50).required(),
    productId: joi.string().required(),
    numberInStock: joi.number().min(0).required(),
    price: joi.number().min(0).required(),
  };
  return joi.validate(data, schema);
}
exports.Info = Info;
exports.validInfo = validInfo;
