import express from 'express'
import cors from 'cors'
import routes from './routes/index'
import dotenv from 'dotenv'

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())
app.use(routes)


app.get('/', (req, res) => {
  res.send('API do Controle Financeiro está no ar 🚀')
})

export default app;