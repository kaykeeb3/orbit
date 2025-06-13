import express from 'express'
import cors from 'cors'
import router from './presentation/http/routes'
import dotenv from 'dotenv'
import { errorHandler } from 'presentation/http/middlewares/errorHandler'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use('/', router)

app.use(errorHandler)

const PORT = process.env.PORT || 3000
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`
const ENV = process.env.NODE_ENV || 'development'

app.listen(PORT, () => {
  console.log(`🚀 Server running on ${BASE_URL} & Environment: ${ENV}`)
})
