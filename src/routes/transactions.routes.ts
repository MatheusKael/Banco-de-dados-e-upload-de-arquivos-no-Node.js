import { Router } from 'express';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService'
import CategoriesRepository from '../repositories/CategoriesRepository';
import { getCustomRepository } from 'typeorm';
const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const list = await transactionsRepository.find();

  return response.json({ Transactions: list });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;
  const categoriesRepository = getCustomRepository(CategoriesRepository);

  const CategoriesExists = await categoriesRepository.findOne({
    title: category,
  });

  console.log(CategoriesExists);

  if (!CategoriesExists) {
    const newCategory = categoriesRepository.create({ title: category });

    await categoriesRepository.save(newCategory);
  }

  const CreateTransaction = new CreateTransactionService();

  const transaction = await CreateTransaction.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transaction);
});

// transactionsRouter.delete('/:id', async (request, response) => {
//   // TODO
// });

// transactionsRouter.post('/import', async (request, response) => {
//   // TODO
// });

export default transactionsRouter;
