const error = require("../../common/error/error-util");
const { pool } = require("../../common/module/mysql-conn");
const bcrypt = require("bcrypt");
const {
  isVerifyRefresh,
  updateToken,
  getSignData,
} = require("../../common/module/token");
// const jwt = require("jsonwebtoken")
// const sqlstring = require("sqlstring")
// const Redis = require("ioredis")

// TODO :: refreshToken 갱신
const refreshToken = () => {
  return async (req, res, next) => {
    const { refreshToken } = req.body;
    try {
      {
        // 갱신
        if (await isVerifyRefresh(refreshToken)) {
          req.token = { ...updateToken(getSignData(refreshToken)) };
          return next();
        }
        next(error("TOKEN_VERIFY_FAIL"));
      }
    } catch (err) {
      next(error(err, 403));
    }
    next();
  };
};

const createUser = () => {
  return async (req, res, next) => {
    try {
      const { password, name, email } = req.body;
      const sql = `SELECT COUNT(id) AS count FROM users WHERE email=?`;
      console.log(sql);
      const [rs] = await pool.execute(sql, [email]);
      if (rs[0].count > 0) {
        // 기존회원존재
        return next(error("EXIST_USER"));
      }
      // 회원가입
      const usrPwHash = await bcrypt.hash(
        password,
        Number(process.env.SALT_RND)
      );
      const sqlInsert = `
      INSERT INTO users 
      (password, name, email) 
      VALUES 
      (?, ?, ?)`;
      const [rsInsert] = await pool.execute(sqlInsert, [
        usrPwHash,
        name,
        email,
      ]);
      req.rs = rsInsert;
      return next();
    } catch (err) {
      return next(error(err));
    }
  };
};

const loginUser = () => {
  return async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const sql = `SELECT * FROM users WHERE email=?`;
      const [rs] = await pool.execute(sql, [email]);
      if (rs[0]) {
        const compare = await bcrypt.compare(password, rs[0].password);
        if (compare) {
          // 로그인 성공
          // TODO :: bcrypt compare(o) -> Token생성(o) -> Redis(RT저장) -> user+TK리턴
          const signData = {
            id: rs[0].id,
            name: rs[0].name,
            email: rs[0].email,
          };
          const userData = {
            ...signData,
            usrDt: rs[0].createdAt,
          };
          // console.log(signData);
          const { accessToken, refreshToken } = updateToken(signData);
          req.users = { user: userData, accessToken, refreshToken };
          return next();
        }
      }
      return next(error("LOGIN_FAIL"));
    } catch (err) {
      return next(error(err));
    }
  };
};

module.exports = { createUser, loginUser, refreshToken };
