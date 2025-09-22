const { body, validationResult } = require("express-validator");
const error = require("../../common/error/error-util");

const joinCreateValidation = () => {
  return [
    body("password").notEmpty().trim().isLength({ min: 3, max: 16 }),
    body("name").notEmpty().trim(),
    body("email").notEmpty().trim().isEmail(),
    (req, res, next) => {
      const err = validationResult(req);

      if (err.isEmpty()) next();
      else next(error(err.array()));
    },
  ];
};

module.exports = { joinCreateValidation };
