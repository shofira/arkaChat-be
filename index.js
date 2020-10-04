const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { PORT } = require('./src/helper/env')

const userRouter = require('./src/routers/user')

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

app.use('/users', userRouter)

app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
})