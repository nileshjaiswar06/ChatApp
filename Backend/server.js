import express from 'express'
import dotenv from 'dotenv'

import authRoutes from './routes/auth.routes.js'
import connectToMongoDB from './db/connectToMongoDB.js'

const app = express()

dotenv.config()

const PORT = process.env.PORT || 8000

app.get('/', (req, res) => {
  res.send("Hello Nilesh")
})

app.use('/api/auth', authRoutes)

app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server is running on port ${PORT}`)
})