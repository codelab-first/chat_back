module.exports = (err, req, res, next) => {
  const status = err?.status || 500;
  res.status(status).json({
    success: "FAIL",
    err: { cod: status, msg: err.message, data: err.data },
  });
};

/** API규칙
 * 성공 => { success: "OK", data: {} }
 * 실패 => { success: "FAIL", error: { cod, msg } }
 */
