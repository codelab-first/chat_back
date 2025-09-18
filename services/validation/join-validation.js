const { body, validationResult } = require("express-validator")
const error = require("../../common/error/error-util")

const joinCreateValidation = () => {
  return [
    body("usrId").notEmpty().trim().isLength({ min: 6, max: 16 }),
    body("usrPw").notEmpty().trim().isLength({ min: 6, max: 16 }),
    body("usrNm").notEmpty().trim(),
    body("usrEmail").notEmpty().trim().isEmail(),
    (req, res, next) => {
      const err = validationResult(req)
      if (err.isEmpty()) next()
      else next(error(err.array()))
    },
  ]
}

module.exports = { joinCreateValidation }
