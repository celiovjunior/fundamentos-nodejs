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

// função para checar o saldo e pegar o balanço da conta
function getBalance(statement) {
  const balance = statement.reduce((acc, operation) => {
    if(operation.type === 'credit') {

      return acc + operation.amount
    
    } else {

      return acc - operation.amount

    }
  }, 0)

  return balance
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

// Depósito
app.post("/deposit", verifyIfExistsAccountCPF, (req, res) => {
  const { description, amount } = req.body

  const { customer } = req

  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: "credit"
  }

  customer.statement.push(statementOperation)

  return res.status(201).send()
})

// Saque
app.post("/withdraw", verifyIfExistsAccountCPF, (req, res) => {
  const { amount } = req.body

  const { customer } = req

  const balance = getBalance(customer.statement)

  if(balance < amount) {
    return res.status(400).json({error: "Operation not allowed"})
  }

  const statementOperation = {
    amount,
    created_at: new Date(),
    type: "debit"
  }

  customer.statement.push(statementOperation)

  return res.send(201).send()
})

app.get("/statement/date", verifyIfExistsAccountCPF, (req, res) => {
  const { customer } = req

  const { date } = req.query

  const dateFormat = new Date(date +  " 00:00")

  // Algoritmo que vai formatar a data de acordo com o dateFormat e depois comparar com a data do created_at no formato de String:
  const statement = customer.statement.filter((statement) => statement.created_at.toDateString() === new Date(dateFormat).toDateString())

  return res.json(statement)
})

app.listen(3333)