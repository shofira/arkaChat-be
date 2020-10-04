const userModel = require('../models/user')
const { success, failed, tokenResult } = require('../helper/response')
const { JWTKEY, MAIL, PS, URL, REFRESHTOKEN } = require('../helper/env')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

const user = {
  register: async (req, res) => {
    try {
      const body = req.body
      const salt = await bcrypt.genSalt(10)
      const hashPass = await bcrypt.hash(body.password, salt)

      const data = {
        name: body.name,
        email: body.email,
        username: body.name,
        password: hashPass,
        active: 0
      }
      userModel.register(data).then(async (result) => {

        const activateKey = jwt.sign({
          email: data.email,
          username: data.username
        }, JWTKEY)

        let transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: MAIL,
            pass: PS
          }
        })
        let info = await transporter.sendMail({
          from: '"ArkaChat" <ArkaChat@gmail.com>',
          to: data.email,
          subject: 'Register Account',
          html:
            `Hello, ${data.name}! <br />
          <p>Please Activate your email to get access in <b>ArkaChat</b> ^_^ <br />
          <a href="${URL}/users/activate/${activateKey}">Klik here to activate</a></p>`
        })
        success(res, result, 'send email success')

      }).catch((err) => failed(res, [], err.message))
    } catch (error) {
      failed(res, [], 'Internal Server Error')
    }
  },
  activate: (req, res) => {
    const token = req.params.token
    if (token) {
      jwt.verify(token, JWTKEY, (err, response) => {
        if (err) {
          failed(res, [], 'Failed activation!')
        } else {
          const email = response.email
          userModel.activation(email)
            .then((result) => {
              success(res, result, 'Email has been activated')
            }).catch((err) => {
              failed(res, [], err.message)
            })
        }
      })
    }
  },
  login: (req, res) => {
    try {
      const body = req.body
      userModel.login(body)
        .then(async (result) => {
          const results = result[0]
          const password = results.password
          const userRefreshToken = results.refreshToken
          const isMatch = await bcrypt.compare(body.password, password)

          if (isMatch) {
            if (results.active === 1) {
              jwt.sign({
                email: results.email,
                username: results.username
              }, JWTKEY, { expiresIn: 20 }, (err, token) => {
                if (err) {
                  failed(res, [], err.message)
                } else {
                  if (userRefreshToken === null) {
                    const id = results.id
                    const refreshToken = jwt.sign({ id }, REFRESHTOKEN)
                    userModel.updateRefreshToken(refreshToken, id).then(() => {
                      const data = {
                        token,
                        refreshToken
                      }
                      tokenResult(res, data, 'Login success')
                    }).catch((err) => {
                      failed(res, [], err.message)
                    })
                  } else {
                    const data = {
                      token,
                      refreshToken
                    }
                    tokenResult(res, data, 'Login success')
                  }
                }
              })
            } else {
              failed(res, [], 'Need Activation')
            }
          } else {
            failed(res, [], 'Incorrect password! Please try again')
          }
        }).catch((err) => {
          failed(res, [], err.message)
        })
    } catch (error) {
      failed(res, [], 'Internal Server Error')
    }
  },
  renewToken: (req, res) => {
    const refreshToken = req.body.refreshToken
    userModel.checkRefreshToken(refreshToken)
      .then((result) => {
        if (result.length >= 1) {
          const user = result[0]
          const newToken = jwt.sign({ email: user.email, username: user.username }, JWTKEY, { expiresIn: 3600 })
          const data = {
            token: newToken,
            refreshToken
          }
          tokenResult(res, data, 'Refresh Token Success')
        } else {
          failed(res, [], 'Refresh Token Not Found')
        }
      })
      .catch((err) => failed(res, [], err.message))
  },
  logout: (req, res) => {
    try {
      const id = req.params.id
      userModel.logout(id)
        .then((result) => {
          success(res, result, 'Logout Success')
        }).catch((err) => {
          failed(res, [], err.message)
        })
    } catch (error) {
      failed(res, [], 'Internal Server Error')
    }
  }

}

module.exports = user