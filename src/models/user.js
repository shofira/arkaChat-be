const db = require('../config/db')

const user = {
  register: (data) => {
    return new Promise((resolve, reject) => {
      db.query(`INSERT INTO users SET ?`, data, (err, res) => {
        if (err) {
          reject(new Error(err))
        } else {
          resolve(res)
        }
      })
    })
  },
  activation: (email) => {
    return new Promise((resolve, reject) => {
      db.query(`UPDATE users SET active = 1 WHERE email = '${email}'`, (err, res) => {
        if (err) {
          reject(new Error(err))
        } else {
          resolve(res)
        }
      })
    })
  },
  login: (data) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM users WHERE email = '${data.email}'`, (err, res) => {
        if (err) {
          reject(new Error(err))
        } else {
          resolve(res)
        }
      })
    })
  },
  updateRefreshToken: (token, id) => {
    return new Promise((resolve,reject) => {
        db.query(`UPDATE users SET refreshToken='${token}' WHERE id ='${id}'`,
        (err,result) => {
            if(err) {
                reject(new Error(err))
            }else{
                resolve(result)
            }
        })
    })
  },
  getUser: (email) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM users WHERE email = '${email}'`, (err, res) => {
        if (err) {
          reject(new Error(err))
        } else {
          if (res.length > 0) {
            resolve(res)
          } else {
            reject('Email tidak ditemukan')
          }
          
        }
      })
    })
  },
  logout: (id) => {
    return new Promise((resolve, reject) => {
      db.query(`UPDATE users SET refreshToken = null WHERE id = '${id}'`, (err, res) => {
        if (err) {
          reject(new Error(err))
        } else {
          resolve(res)
        }
      })
    })
  }
}

module.exports = user