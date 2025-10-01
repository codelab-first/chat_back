const Air = require("../models")

async function getAirSidoData(req, res, next) {
  try {
    const targetSido = req.query.sidoName

    const queryOption = {
      // raw: true,
    }
    if (targetSido && targetSido.trim() !== "") {
      queryOption.where = { regionName: targetSido }
    }
    const airData = await Air.findAll(queryOption)
    console.log(
      `"${targetSido || "전국"}"의 대기오염 정보: ${airData.length} 개 조회`
    )
    return res.status(200).json(airData)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "데이터 조회 중 서버 오류 발생" })
    next(err)
  }
}

module.exports = { getAirSidoData }
