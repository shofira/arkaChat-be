const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const http = require('http')
const socketio = require('socket.io')
const db = require('./src/config/db')
const { PORT, DB } = require('./src/helper/env')
const { authenticate, authorize } = require('./src/helper/auth')

// import router
const userRouter = require('./src/routers/user')
const { join } = require('path')

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
app.use(express.static('src/images'))

app.use('/users', userRouter)

const server = http.createServer(app)
const io = socketio(server)

io.on('connection', (socket) => {
  console.log('User Connected!')

  socket.on('get-all-users', (id) => {
    db.query(`SELECT * FROM users`, (err, result) => {
      if (err) {
        console.log(err)
      } else {
        io.emit('list-users', result)
      }
    })
  })

  socket.on('send-message', (payload) => {
    const message = `${payload.sender} : ${payload.message}`
    io.to(payload.receiver).emit('list-messages', {
      sender: payload.sender,
      receiver: payload.receiver,
      message: message
    })
  })

  socket.on('join-room', (payload) => {
    socket.join(payload.user)
  })

  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', (data))
  })

  socket.on('stopTyping', (data) => {
    socket.broadcast.emit('stopTyping', (data))
  })

  socket.on('disconnect', () => {
    console.log('User disconnect!')
  })
})

server.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
})