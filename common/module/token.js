const Redis = require("ioredis")
const jwt = require("jsonwebtoken")

// 토큰 갱신
const updateToken = (signData) => {
  const accessToken = jwt.sign({ data: signData }, process.env.SALT_JWT, {
    expiresIn: process.env.EXP_ACC_JWT,
  })
  const refreshToken = jwt.sign({ data: signData }, process.env.SALT_JWT, {
    expiresIn: process.env.EXP_REF_JWT,
  })
  const redis = new Redis()
  if (!signData.usrId) throw new Error("Redis Key undefined")
  redis.set(`RT:${signData.usrId}`, refreshToken)
  return { accessToken, refreshToken }
}

// 리프래시 토큰 검증
const isVerifyRefresh = async (refreshToken) => {
  const clientTokenValid = jwt.verify(refreshToken, process.env.SALT_JWT)
  const usrId = clientTokenValid?.data?.usrId || ""

  const redis = new Redis()
  const redisToken = await redis.get(`RT:${usrId}`)
  jwt.verify(redisToken, process.env.SALT_JWT)
  return refreshToken === redisToken
}

// 토큰정보 가져오기
const getSignData = (token) => {
  const { data } = jwt.verify(token, process.env.SALT_JWT)
  return data
}

module.exports = { updateToken, isVerifyRefresh, getSignData }
