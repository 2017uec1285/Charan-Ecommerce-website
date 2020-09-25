const joi = require("joi");
joi.objectId = require("joi-objectid")(joi);
const mongoose = require("mongoose");
const Rental = mongoose.model(
  "Rental",
  new mongoose.Schema({
    customer: {
      type: new mongoose.Schema({
        name: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 50,
        },
        phone: {
          type: String,
          required: true,
          maxlength: 50,
          minlength: 5,
        },
        isGold: {
          type: Boolean,
          default: false,
        },
      }),
      required: true,
    },
    info: {
      type: new mongoose.Schema({
        title: {
          type: String,
          required: true,
          trim: true,
          minlength: 5,
          maxlength: 255,
        },
        price: {
          type: Number,
          required: true,
          min: 0
        },
      }),
      required: true,
    },
    dateOut: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dateReturned: {
      type: Date,
    },
    rentalFee: {
      type: Number,
      min: 0,
    },
  })
);
function validRental(rental) {
  const schema = {
    customerId: joi.objectId().required(),
    infoId: joi.objectId().required(),
  };
  return joi.validate(rental, schema);
}
exports.Rental = Rental;
exports.validRental = validRental;
