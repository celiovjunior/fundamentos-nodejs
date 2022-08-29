<h2 align="center">Fundamentos do NodeJS na prática</h2>

___

### 📢 Sobre:
Projeto desenvolvido para por em prática conceitos fundamentais do **NodeJS** para a construção de uma API simples, utilizando métodos http, implementação de requisitos e regras de negócio referente a criação de uma conta bancária e acesso de dados do cliente.<br>

___

### 🧱 Tecnologias:
Lista de algumas bibliotecas/frameworks externas que foram utilizadas para a construção do projeto:
- [Nodemon](https://www.npmjs.com/package/nodemon)
- [Express](https://expressjs.com/pt-br/)
- [UUID](https://www.npmjs.com/package/uuid)
___

### 🔓 Baixando o projeto:
Os comandos a seguir se referem ao terminal do [GitBash](https://git-scm.com/downloads)
```bash

# Clonando o repositório com SSH
$ git clone git@github.com:celiovjunior/fundamentos-nodejs.git

# Entrando na pasta do projeto
$ cd fundamentos-node

# Instalando as dependências necessárioas
$ npm install

# Executando o projeto
$ npm run dev

```
___

### 🔦 Rotas:

- URL Base
```
http://localhost:3333/
```
- Inserindo dados do cliente
```
http://localhost:3333/account
```
- Buscando extrato de um cliente de acordo com CPF
```
http://localhost:3333/statement
```
- Inserindo depósito na conta
```
http://localhost:3333/deposit
```
- Fazendo um saque
```
http://localhost:3333/withdraw
```
- Buscando informações das transações pela data
```
http://localhost:3333/statement/date
```
- Atualizar dados do cliente
```
http://localhost:3333/account
```
- Exibir informações do cliente
```
http://localhost:3333/account
```
- Deletando um cliente
```
http://localhost:3333/account
```
- Pegando informações do balanço da conta
```
http://localhost:3333/balance
```
