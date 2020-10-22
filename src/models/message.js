const db = require("../config/db");

const message = {
  destroy: (id) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM message WHERE id = '${id}'`, (err, result) => {
        if (err) {
          reject(new Error(err))
        } else {
          db.query(`DELETE FROM message WHERE id = ?`, id, (err, res) => {
            if (err) {
              reject(new Error(err))
            } else {
              resolve(res)
            }
          })
        }
      })
    })
  }
}

module.exports = message