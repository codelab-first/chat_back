const express = require("express");
const router = express.Router();
const {
  joinCreateValidation,
} = require("../services/validation/join-validation");
const {
  createUser,
  loginUser,
  refreshToken,
} = require("../services/mysql/public-svc");
const error = require("../common/error/error-util");

router.get("/test", (req, res) => {
  res.status(200).json({ success: "ok" });
});

router.post("/join", joinCreateValidation(), createUser(), (req, res, next) => {
  res.status(200).json({ success: "OK" });
});
router.post("/login", loginUser(), (req, res, next) => {
  // console.log(req.users);
  res.status(200).json({ success: "OK", data: req.users });
});

router.post("/refresh", refreshToken(), (req, res, next) => {
  res.status(200).json({ success: "OK", data: req.token });
});
router.get("/join", (req, res, next) => {
  res.status(200).json({ success: "OK" });
});
module.exports = router;
