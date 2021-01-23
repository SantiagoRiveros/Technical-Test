const { Router } = require("express");
//aca estoy importando las rutas en si:
const userRouter = require("./User.js");
const accountRouter = require("./Account.js");
const cors = require("cors");

const router = Router();

router.use(cors());
router.use("/user", userRouter);
router.use("/account", accountRouter);

module.exports = router;
