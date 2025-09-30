const Air = require("../models")

async function getAirSido(req, res, next) {
  try {
    const queryOption = {
      // raw: true,
    }
    if (targetSido && targetSido.trim() !== "") {
      queryOption.where = { sidoName: targetSido }
    }
  }

  const airData = await Air.findAll(queryOption);

  console.log(`"${targetSido || "전국"}"의 대기오염 정보: ${airData.length} 개 조회`);
  return airData;
} catch (err) {
  console.error(err);
  throw(err);
}
