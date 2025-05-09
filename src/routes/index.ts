import { Router } from 'express';
import {
  criarConta,
  listarContas,
  atualizarConta,
  excluirConta,
  filtrarContas,
  atualizarStatusPagamento
} from '../controller/Conta';

const router = Router();

router.post('/contas', criarConta);
router.get('/contas', listarContas);
router.get('/contas/filtro', filtrarContas);
router.put('/contas/:id', atualizarConta);
router.delete('/contas/:id', excluirConta);
router.patch('/contas/:id/pagar', atualizarStatusPagamento);

export default router;
