const { Rental, validRental } = require("../model/rental");
const { Info } = require("../model/info");
const { Customer } = require("../model/customer");
const mongoose = require("mongoose");
const Fawn = require("fawn");
const express = require("express");
const router = express.Router();
Fawn.init(mongoose);
router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});
router.post("/", async (req, res) => {
  const { error } = validRental(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid customer id.");
  const item = await Info.findById(req.body.infoId);
  if (!item) return res.status(400).send("Invalid info id.");
  if (item.numberInStock === 0)
    return res.status(400).send("data not in stack.");

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    info: {
      _id: item._id,
      title: item.title,
      price: item.price,
    }
  });
  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update(
        "infos",
        { _id: item._id },
        {
            $inc: { numberInStock: -1 },
        }
      )
      .run();
    res.send(rental);
  } catch (ex) {
    res.status(500).send("Somthing failed.");
  }
});
router.get("/:id", async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental) res.status(404).send("data not found");

  res.send(rental);
});
module.exports = router;
