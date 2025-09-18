const error = require("../../common/error/error-util")
const { pool } = require("../../common/module/mysql-conn")
const sqlstring = require("sqlstring")
const { createVirtualPath } = require("../../common/module/util")

// const formattedSql = sqlstring.format(sql, [])
// console.log(formattedSql)
// INSERT INTO book (field1, field2, ...) VALUES (?, ?, ?, ?)
// INSERT INTO book SET field1 = ?, field2 = ? ...
// SELECT * FROM book
// SELECT * FROM book WHERE (조건) id=1(?) , title like '%별%' , id>2
// SELECT * FROM book WHERE (조건) ORDER BY id ASC (id DESC)
// SELECT * FROM book WHERE (조건) ORDER BY id ASC (id DESC) LIMIT 시작Idx, 레코드수
// /book, /book/1, /book?page=1
const bookList = ({ field = "id", sort = "DESC" } = {}) => {
  return async (req, res, next) => {
    try {
      const pageCnt = 10
      const { page = 1 } = req.query
      const { id } = req.params
      let sql = ` SELECT p.*, b.*, p.id AS pid FROM book AS b `
      sql += ` LEFT JOIN pds AS p ON b.id = p.book_id `
      if (id) sql += ` WHERE b.id = ? `
      sql += ` ORDER BY b.${field} ${sort} `
      sql += ` LIMIT ${(page - 1) * pageCnt}, ${pageCnt} `
      const [rs] = await pool.execute(sql, id ? [id] : [])
      for (const book of rs) {
        if ((book.file_typ || "").includes("image")) {
          book.imgSrc = createVirtualPath(book.file_nm)
        }
      }
      req.rs = rs || []
      next()
    } catch (err) {
      next(error(err))
    }
  }
}

const bookCreate = () => {
  return async (req, res, next) => {
    try {
      const file = req.file
      const { title, content, writer, publish_d } = req.body
      const sql = ` 
        INSERT INTO booK (title, content, writer, publish_d)
        VALUES (?, ?, ?, ?)`
      const [rs] = await pool.execute(sql, [
        title,
        content,
        writer || null,
        publish_d || null,
      ])
      if (file) {
        const sql2 = `
          INSERT INTO pds (origin_nm, file_nm, file_typ, book_id)
          VALUES (?, ?, ?, ?)`
        await pool.execute(sql2, [
          file.originalname,
          file.filename,
          file.mimetype,
          rs.insertId,
        ])
      }
      next()
    } catch (err) {
      next(error(err))
    }
  }
}

module.exports = { bookList, bookCreate }
