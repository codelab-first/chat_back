const { body, validationResult } = require("express-validator")
const error = require("../../common/error/error-util")
const fs = require("fs-extra")

const bookCreateValidation = () => {
  return [
    body("title").notEmpty().escape(),
    body("writer").optional({ checkFalsy: true }).escape(),
    body("content").optional({ checkFalsy: true }).escape(),
    body("publish_d").optional({ checkFalsy: true }).isDate(),
    async (req, res, next) => {
      const err = validationResult(req)
      if (err.isEmpty()) next()
      else {
        if (req.file) await fs.remove(req.file.path)
        next(error(err.array()))
      }
    },
  ]
}

module.exports = { bookCreateValidation }
