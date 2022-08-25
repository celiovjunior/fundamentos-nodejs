import express from 'express'
import { v4 as uuidv4 } from 'uuid'

const app = express()


const customers = []
/**
 * - MODEL: 
 * cpf = string
 * name = string
 * id = uuid
 * statement = []
 */

app.use(express.json())

app.post("/account", (req, res) => {
  const { cpf, name } = req.body

  const customerAlreadyExists = customers.some((customer) => customer.cpf === cpf)

  if(customerAlreadyExists) {
    res.status(400).json({ error: "Customer already exists" })
  }

  const id = uuidv4()

  customers.push({
    cpf,
    name,
    id,
    statement: []
  })

  return res.status(201).send()

})

app.listen(3333)