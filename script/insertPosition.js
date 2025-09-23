const fs = require("fs")
const path = require("path")
const Position = require("../models/position") // 모델 경로를 프로젝트에 맞게 수정하세요.

const insertPosition = async () => {
  try {
    // 1. JSON 파일 읽기 및 데이터 파싱
    const jsonPath = path.join(__dirname, "json", "airMeasureLocation.json") // JSON 파일 경로를 프로젝트에 맞게 수정하세요.
    const fileData = fs.readFileSync(jsonPath, "utf8")
    const parsedData = JSON.parse(fileData)

    // 2. 실제 데이터가 포함된 'items' 배열에 접근
    const itemsToInsert = parsedData.response.body.items

    // 3. Sequelize bulkCreate를 사용하여 데이터베이스에 대량 삽입
    await Position.bulkCreate(itemsToInsert, {
      ignoreDuplicates: true, // `stationName`이 중복되는 경우 무시하고 진행
    })

    console.log("JSON 데이터가 성공적으로 삽입되었습니다!")
  } catch (error) {
    console.error("데이터 삽입 중 오류 발생:", error)
  }
}

module.exports = insertPosition
