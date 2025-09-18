const error = require("../../common/error/error-util")
const { pool } = require("../../common/module/mysql-conn")
const bcrypt = require("bcrypt")
const {
  isVerifyRefresh,
  updateToken,
  getSignData,
} = require("../../common/module/token")
// const jwt = require("jsonwebtoken")
// const sqlstring = require("sqlstring")
// const Redis = require("ioredis")

// TODO :: refreshToken 갱신
const refreshToken = () => {
  return async (req, res, next) => {
    const { refreshToken } = req.body
    try {
      {
        // 갱신
        if (await isVerifyRefresh(refreshToken)) {
          req.token = { ...updateToken(getSignData(refreshToken)) }
          return next()
        }
        next(error("TOKEN_VERIFY_FAIL"))
      }
    } catch (err) {
      next(error(err, 403))
    }
    next()
  }
}

const createUser = () => {
  return async (req, res, next) => {
    try {
      const { usrId, usrPw, usrNm, usrEmail } = req.body
      const sql = `SELECT COUNT(id) AS count FROM user WHERE usr_id=? OR usr_email=?`
      const [rs] = await pool.execute(sql, [usrId, usrEmail])
      if (rs[0].count > 0) {
        // 기존회원존재
        return next(error("EXIST_USER"))
      }
      // 회원가입
      const usrPwHash = await bcrypt.hash(usrPw, Number(process.env.SALT_RND))
      const sqlIsert = `
      INSERT INTO user 
        (usr_id, usr_pw, usr_nm, usr_email) 
      VALUES 
        (?, ?, ?, ?)`
      const [rsInsert] = await pool.execute(sqlIsert, [
        usrId,
        usrPwHash,
        usrNm,
        usrEmail,
      ])
      req.rs = rsInsert
      return next()
    } catch (err) {
      return next(error(err))
    }
  }
}

const loginUser = () => {
  return async (req, res, next) => {
    try {
      const { usrId, usrPw } = req.body
      const sql = `SELECT * FROM user WHERE usr_id=?`
      const [rs] = await pool.execute(sql, [usrId])
      if (rs[0]) {
        const compare = await bcrypt.compare(usrPw, rs[0].usr_pw)
        if (compare) {
          // 로그인 성공
          // TODO :: bcrypt compare(o) -> Token생성(o) -> Redis(RT저장) -> user+TK리턴
          const signData = {
            id: rs[0].id,
            usrId: rs[0].usr_id,
            usrNm: rs[0].usr_nm,
            usrEmail: rs[0].usr_email,
            usrLv: rs[0].usr_lv,
          }
          const userData = {
            ...signData,
            usrDt: rs[0].created_dt,
          }
          const { accessToken, refreshToken } = updateToken(signData)
          req.users = { user: userData, accessToken, refreshToken }
          return next()
        }
      }
      return next(error("LOGIN_FAIL"))
    } catch (err) {
      return next(error(err))
    }
  }
}

module.exports = { createUser, loginUser, refreshToken }
