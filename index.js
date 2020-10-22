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
const MessageRouter = require('./src/routers/message')
const { join } = require('path')

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
app.use(express.static('src/images'))

app.use('/users', userRouter)
app.use('/message', MessageRouter)

const server = http.createServer(app)
const io = socketio(server)

io.on('connection', (socket) => {
  socket.on('get-all-users', () => {
    db.query(`SELECT * FROM users`, (err, result) => {
      if (err) {
        console.log(err)
      } else {
        io.emit('list-users', result)
      }
    })
  })

  socket.on('join-room', (payload) => {
    socket.join(payload.user)
  })
  
  
  socket.on('send-message', (payload) => {
    db.query(`INSERT INTO message (sender, receiver, message) VALUES ('${payload.sender}','${payload.receiver}','${payload.message}')`, (err,result) =>{
      if(err){
        console.log(new Error(err))
      } else {
        io.to(payload.receiver).emit('list-message', {
            sender: payload.username,
            receiver: payload.receiver,
            msg: payload.message
        })
      }
    })
  })
  
  socket.on('get-history-message', (payload) => {
    db.query(`SELECT * FROM message WHERE (sender = '${payload.sender}' AND receiver = '${payload.receiver}') 
    OR (sender = '${payload.receiver}' AND receiver = '${payload.sender}')`,(err,result) => {
      if(err) {
        console.log(err)
      }else {
        io.to(payload.sender).emit('history-list-messages', result)
      }
    })
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