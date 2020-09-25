const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const { Product, validProduct } = require("../model/product");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const products = await Product.find().sort("name");
  res.send(products);
});
router.post("/", auth, async (req, res) => {
  const { error } = validProduct(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const product = new Product({ name: req.body.name });
  await product.save();
  res.send(product);
});
router.delete("/:id", [validateObjectId, auth, admin], async (req, res) => {
  const product = await Product.findByIdAndRemove(req.params.id);

  if (!product) return res.status(404).send("data not found");

  return res.send(product);
});
router.put("/:id", validateObjectId, async (req, res) => {
  const { error } = validProduct(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    {
      new: true,
    }
  );

  if (!product) return res.status(400).send("data not found");

  return res.send(product);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) res.status(404).send("Data not found");
  res.send(product);
});
module.exports = router;
