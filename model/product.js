const joi = require("joi");
const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
});
const Product = mongoose.model("Product", productSchema);
function validProduct(product) {
  const schema = {
    name: joi.string().min(2).max(50).required(),
  };
  return joi.validate(product, schema);
}
exports.productSchema = productSchema;
exports.Product = Product;
exports.validProduct = validProduct;
