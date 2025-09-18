const error = require("../../common/error/error-util")
const { pool } = require("../../common/module/mysql-conn")

// SELECT * FROM book
// SELECT * FROM book WHERE (조건) id=1 , title like '%별%' , id>2
// SELECT * FROM book WHERE (조건) ORDER BY id ASC (id DESC)
// SELECT * FROM book WHERE (조건) ORDER BY id ASC (id DESC) LIMIT 시작Idx, 레코드수
// /book, /book/1, /book?page=1
const bookList = ({ field = "id", sort = "DESC" } = {}) => {
  return async (req, res, next) => {
    try {
      // mongoose()
      next()
    } catch (err) {
      next(error(err))
    }
  }
}
