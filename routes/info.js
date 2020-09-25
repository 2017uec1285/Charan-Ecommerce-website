const { Info, validInfo } = require("../model/info");
const { Product } = require("../model/product");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const Items = await Info.find().sort("title");
  res.send(Items);
});
router.post("/", async (req, res) => {
  const { error } = validInfo(req.body);

  if (error) return res.status(400).send(error.details[0].message);
  let product = await Product.findById(req.body.productId);

  if (!product) return res.status(400).send("Invalid product.");
  let item = new Info({
    title: req.body.title,
    product: {
      _id: product._id,
      name: product.name,
    },
    numberInStock: req.body.numberInStock,
    price: req.body.price,
  });
  item = await item.save();
  product = await product.save();
  res.send(item);
});
router.delete("/:id", [validateObjectId, auth, admin], async (req, res) => {
  const item = await Info.findByIdAndRemove(req.params.id);

  if (!item) return res.status(404).send("data not found");

  return res.send(item);
});
router.put("/:id", validateObjectId, auth, async (req, res) => {
  const { error } = validInfo(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  const product = await Product.findById(req.body.productId);
  if (!product) return res.status(400).send("Invalid product.");
  const item = await Info.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      product: {
        _id: product._id,
        name: product.name,
      },
      numberInStock: req.body.numberInStock,
      price: req.body.price,
    },
    {
      new: true,
    }
  );

  if (!item) return res.status(404).send("data not found");

  return res.send(item);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const item = await Info.findById(req.params.id).select("-_v");
  if (!item) res.status(404).send("data not found");

  res.send(item);
});
module.exports = router;
