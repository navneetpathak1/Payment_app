const express = require("express");
const useRouter = require("./user")


const accountRouter = require("./account");

const router = express.Router();

router.use("/user", useRouter);
router.use("/account", accountRouter);

module.exports = router;

