# ControleFinanceiroBackend

## **Backend (`ControleFinanceiroBackend`)**

```md
# Controle Financeiro - Backend

API RESTful desenvolvida em **Node.js, Express e MySQL** para gerenciar lançamentos de despesas. O sistema suporta **despesas únicas**, **parceladas** e **recorrentes**, com geração automática de múltiplos registros com vencimentos mensais e status de pagamento. Conta com **testes automatizados**.

## 🚀 Funcionalidades

- Cadastro de despesas com:
  - Parcelamento automático (`1/4`, `2/4`, etc.)
  - Recorrência mensal (`1/6`, `2/6`, etc.)
  - Cheques com campos específicos
- Listagem e filtros por:
  - Nome
  - Categoria
  - Intervalo de datas
- Atualização de status de pagamento
- Edição e exclusão de contas
- Testes unitários com Jest + Supertest

## 🛠 Tecnologias utilizadas

- Node.js
- Express
- TypeScript
- MySQL
- Jest
- Supertest
- Dotenv

## 📦 Instalação local

```bash
git clone https://github.com/LorranFernandes/ControleFinanceiroBackend.git
cd ControleFinanceiroBackend
npm install
npm run dev
