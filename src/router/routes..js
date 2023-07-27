const express = require("express");
const router = express.Router();

const {
  createANewUser,
  userLogin,
  depositIntoWallet,
  withdrawFromWallet,
  transferMoney,
} = require("../controller/controller");
const { validateRequest, schemas } = require("../utils/validate");
const auth = require("../middleware/authenticate");

router.post("/signup", validateRequest(schemas.authSchema), createANewUser);
router.post("/login", validateRequest(schemas.authSchema), userLogin);
router.post("/deposit", validateRequest(schemas.depositWithdrawalDraftSchema), auth, depositIntoWallet );
router.post("/withdraw", auth, validateRequest(schemas.depositWithdrawalDraftSchema), withdrawFromWallet );
router.post("/transfer", auth, transferMoney);

module.exports = router;
