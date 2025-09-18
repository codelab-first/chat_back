module.exports = (req, res, next) => {
  const err = new Error("NOT_FOUND")
  err.status = 404
  next(err)
}
