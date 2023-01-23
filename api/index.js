import express from 'express';
import swaggerUi from "swagger-ui-express";
import { v4 as uuidv4 } from 'uuid';
import swaggerDocument from '../swagger.json' assert { type: "json" };

const app = express()

/**
 * - MODEL: 
 * cpf = string
 * name = string
 * id = uuid
 * statement = []
 */
const customers = []

app.use(express.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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

// Pegando informações das transações pela data
app.get("/statement/date", verifyIfExistsAccountCPF, (req, res) => {
  const { customer } = req

  const { date } = req.query

  const dateFormat = new Date(date +  " 00:00")

  // Algoritmo que vai formatar a data de acordo com o dateFormat e depois comparar com a data do created_at no formato de String:
  const statement = customer.statement.filter((statement) => statement.created_at.toDateString() === new Date(dateFormat).toDateString())

  return res.json(statement)
})

// Atualizar dados do cliente
app.put("/account", verifyIfExistsAccountCPF, (req, res) => {
  const { name } = req.body

  const { customer } = req

  customer.name = name

  return res.status(201).send()
})

// Exibir informações do cliente
app.get("/account/:id", verifyIfExistsAccountCPF, (req, res) => {
  const { customer } = req

  return res.json(customer)
})

// Deletando um cliente (sando método de array)
app.delete("/account", verifyIfExistsAccountCPF, (req, res,) => {
  const { customer } = req

  // Usando o método splice, comum em Array
  customers.splice(customer, 1)

  // res.status(204)
  return res.status(200).json(customers)
})

// Pegando informações do balanço da conta
app.get("/balance", verifyIfExistsAccountCPF, (req, res) => {
  const { customer } = req

  const balance = getBalance(customer.statement)

  return res.json(balance)
})

app.listen(4000)