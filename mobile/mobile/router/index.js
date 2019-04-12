//JavaScript Document
let express = require("express");
let router = express.Router();

router.use("/intelligent", require("./intelligent"));

module.exports = router;