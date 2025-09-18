/**
 * 200: 성공
 * 400: 필수 파라미터 누락
 *  -> UI처리를 위해 200으로 전송하는 케이스도 있음 (비지니스에러)
 * 401: AccessToken 검증 실패
 * 403: 미인증 상태 (RefreshToken만료, 접근 불가)
 * 404: 잘못된 주소 접근
 * 500: 서버에러(서버점검, 네트워크점검 필요)
 */

const { isProd } = require("../module/util")

const error = (errCode, status) => {
  const err = new Error()
  if (Array.isArray(errCode)) {
    // express-validation 에서 오는 에러일때
    err.message = "유효성 검사 실패"
    err.status = 200
    err.data = errCode
    return err
  } else if (errCode instanceof Error) {
    // errCode 자체가 에러객체일때
    errCode.status = status || 500
    if (!isProd() && errCode.sql) {
      errCode.data = {
        message: errCode?.message || "",
        code: errCode?.code || "",
        errno: errCode?.errno || "",
        sqlMessage: errCode?.sqlMessage || "",
        sqlState: errCode?.sqlState || "",
        sql: errCode?.sql || "",
      }
    }
    return errCode
  } else {
    // My Error - 규격화
    let message = "UNKNOWN ERROR"
    let code = 500
    switch (errCode) {
      case "BAD_PARAMS":
        message = "파라메터가 잘못되었습니다."
        code = 200
        break
      case "EXIST_USER":
        message = "기존 회원 정보가 있습니다."
        code = 200
        break
      case "LOGIN_FAIL":
        message = "아이디와 패스워드를 확인하세요."
        code = 200
        break
      case "TOKEN_VERIFY_FAIL":
        message = "토큰검증실패"
        code = 403
        break
      case "ACCESS_TOKEN_VERIFY_FAIL":
        message = "엑세스토큰 검증 실패"
        code = 401
        break
      case "IS_NOT_ADMIN":
        message = "관리자 권한이 없습니다."
        code = 200
        break
      default:
        break
    }
    err.message = message
    err.status = code
    return err
  }
}

module.exports = error
