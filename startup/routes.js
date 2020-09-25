const express = require("express");
const error = require("../middleware/error");
const products = require("../routes/products");
const info = require("../routes/info");
const customers = require("../routes/customers");
const rental = require("../routes/rentals");
const user = require("../routes/user");
const auth = require("../routes/auth");
const returns = require("../routes/returns");
const cors = require("cors");

module.exports = function (app) {
  app.use(cors());
  app.use(express.json());
  app.use("/api/products", products);
  app.use("/api/info", info);
  app.use("/api/customers", customers);
  app.use("/api/rentals", rental);
  app.use("/api/user", user);
  app.use("/api/auth", auth);
  app.use("/api/returns", returns);
  app.use(error);
};
