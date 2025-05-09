import request from 'supertest'
import app from '../src/index'

// Variável global para armazenar o ID da conta criada
let contaCriadaId: number

describe('Testes completos do ContaController', () => {
  
  it('Deve criar uma nova conta', async () => {
    const response = await request(app)
      .post('/contas')
      .send({
        nome: 'Conta de Teste',
        tipo: 'cheque',
        valor: 200,
        categoria: 'Utilidade',
        data_vencimento: '2025-05-10',
        parcelas: null,
        recorrencia_meses: null,
        esta_paga: false
      })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('mensagem')
  })

  it('Deve listar contas e salvar o ID da conta de teste', async () => {
    const response = await request(app).get('/contas')
    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)

    const conta = response.body.find((c: any) => c.nome === 'Conta de Teste')
    expect(conta).toBeDefined()
    contaCriadaId = conta.id
  })

  it('Deve filtrar conta pelo nome', async () => {
    const response = await request(app).get('/contas/filtro').query({ nome: 'Teste' })
    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
    expect(response.body.some((c: any) => c.nome.includes('Teste'))).toBe(true)
  })

  it('Deve atualizar a conta criada', async () => {
    const response = await request(app)
      .put(`/contas/${contaCriadaId}`)
      .send({
        nome: 'Conta Atualizada',
        tipo: 'cheque',
        valor: 250,
        categoria: 'Atualizada',
        data_vencimento: '2025-06-01',
        parcelas: null,
        recorrencia_meses: null,
        esta_paga: false
      })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('mensagem')
  })

  it('Deve marcar a conta como paga', async () => {
    const response = await request(app)
      .patch(`/contas/${contaCriadaId}/pagar`)
      .send({ esta_paga: true })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('mensagem')
  })

  it('Deve excluir a conta criada', async () => {
    const response = await request(app).delete(`/contas/${contaCriadaId}`)
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('mensagem')
  })
})
