"use strict";

require("dotenv").config();

var env = process.env.NODE_ENV || "development";
var config = require("./configs/config");

var express = require("express");
var app = express(); 
const bodyParser = require("body-parser");

const mongoose = require("./configs/mongodb");
const constants = require("./configs/constants"); 
var utils = require("./utils/util"); 
console.log("Entering environment \"" + env + "\"");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/images", express.static(__dirname + "/uploads"));

require("./configs/loader")(app, mongoose, utils, config, constants);

app.listen(config.port, function () {
    console.log("Server Listening to port :", config.port);
});

module.exports = app;