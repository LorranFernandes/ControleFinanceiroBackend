import { Request, Response } from 'express'
import { connection } from '../database'

export async function criarConta(req: Request, res: Response) {
  const {
    nome,
    tipo,
    valor,
    categoria,
    data_vencimento,
    parcelas,
    recorrencia_meses,
    esta_paga,
    numero_conta,
    banco,
    titular,
    beneficiario
  } = req.body

  try {
    const dataBase = new Date(data_vencimento)

    const contasParaInserir = []

    const total = tipo === 'parcelada' ? parcelas : tipo === 'periodica' ? recorrencia_meses : 1

    for (let i = 0; i < total; i++) {
      const novaData = new Date(dataBase)
      novaData.setMonth(novaData.getMonth() + i)

      // Gera string tipo "1/4" para parcelas ou recorrência
      const valorParcela = tipo === 'parcelada' ? `${i + 1}/${parcelas}` : null
      const valorRecorrente = tipo === 'periodica' ? `${i + 1}/${recorrencia_meses}` : null

      contasParaInserir.push([
        `${nome} ${valorParcela ?? valorRecorrente ?? ''}`.trim(),
        tipo,
        valor,
        categoria,
        novaData.toISOString().split('T')[0],
        valorParcela,
        valorRecorrente,
        esta_paga || false,
        tipo === 'cheque' ? numero_conta : null,
        tipo === 'cheque' ? banco : null,
        tipo === 'cheque' ? titular : null,
        tipo === 'cheque' ? beneficiario : null
      ])
    }

    const sql = `
      INSERT INTO contas 
      (nome, tipo, valor, categoria, data_vencimento, parcelas, recorrencia_meses, esta_paga, numero_conta, banco, titular, beneficiario)
      VALUES ?
    `

    await connection.query(sql, [contasParaInserir])

    res.status(201).json({ mensagem: 'Contas criadas com sucesso!' })
  } catch (error) {
    console.error('Erro ao criar contas:', error)
    res.status(500).json({ erro: 'Erro ao criar contas' })
  }
}


export async function listarContas(req: Request, res: Response) {
  try {
    const [rows] = await connection.execute('SELECT * FROM contas')
    res.status(200).json(rows)
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao listar contas' })
  }
}


// src/controllers/ContaController.ts

export async function atualizarConta(req: Request, res: Response) {
  const { id } = req.params;
  const {
    nome,
    tipo,
    valor,
    categoria,
    data_vencimento,
    parcelas,
    recorrencia_meses,
    esta_paga
  } = req.body;

  try {
    await connection.execute(
      `UPDATE contas SET nome = ?, tipo = ?, valor = ?, categoria = ?, data_vencimento = ?, parcelas = ?, recorrencia_meses = ?, esta_paga = ? WHERE id = ?`,
      [nome, tipo, valor, categoria, data_vencimento, parcelas, recorrencia_meses, esta_paga, id]
    );
    res.status(200).json({ mensagem: 'Conta atualizada com sucesso!' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar conta', detalhes: error });
  }
}

export async function excluirConta(req: Request, res: Response) {
  const { id } = req.params;

  try {
    await connection.execute(`DELETE FROM contas WHERE id = ?`, [id]);
    res.status(200).json({ mensagem: 'Conta excluída com sucesso!' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao excluir conta', detalhes: error });
  }
}

export async function filtrarContas(req: Request, res: Response) {
  const { data_inicio, data_fim, categoria, nome } = req.query;

  let query = 'SELECT * FROM contas WHERE 1=1';
  const params: any[] = [];

  if (data_inicio && data_fim) {
    query += ' AND data_vencimento BETWEEN ? AND ?';
    params.push(data_inicio, data_fim);
  }

  if (categoria) {
    query += ' AND categoria = ?';
    params.push(categoria);
  }

  if (nome) {
    query += ' AND nome LIKE ?';
    params.push(`%${nome}%`);
  }

  try {
    const [rows] = await connection.execute(query, params);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao filtrar contas', detalhes: error });
  }
}


export async function atualizarStatusPagamento(req: Request, res: Response) {
  const { id } = req.params;
  const { esta_paga } = req.body;

  try {
    await connection.execute(
      `UPDATE contas SET esta_paga = ? WHERE id = ?`,
      [esta_paga, id]
    );
    res.status(200).json({ mensagem: 'Status de pagamento atualizado com sucesso!' });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao atualizar status de pagamento', detalhes: error });
  }
}