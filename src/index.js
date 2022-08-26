import express from 'express'
import { v4 as uuidv4 } from 'uuid'

const app = express()


const customers = []
// função Middleware
function verifyIfExistsAccountCPF(req, res, next) {
  const { cpf } = req.headers

  const customer = customers.find((customer => customer.cpf === cpf))
  
  if(!customer) {
    return res.status(400).json({ error: "Customer not found" })
  }

  // Fazendo o middleware ter acesso ao request customer
  req.customer = customer

  return next()

}

/**
 * - MODEL: 
 * cpf = string
 * name = string
 * id = uuid
 * statement = []
 */

app.use(express.json())

// Incluindo o middleware em todas as rotas:
// app.use(verifyIfExistsAccountCPF)


// Inserindo os dados de um cliente
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

// Buscando o extrato de um cliente de acordo com seu CPF
app.get("/statement", verifyIfExistsAccountCPF, (req, res) => {
  const { customer } = req
  return res.json(customer.statement)

})

app.listen(3333)