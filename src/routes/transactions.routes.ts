import { Router } from 'express';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import CategoriesRepository from '../repositories/CategoriesRepository';
import { getCustomRepository } from 'typeorm';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';
import multer from 'multer'
import uploadConfig from '../config/upload'
const transactionsRouter = Router();

const upload = multer(uploadConfig)

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const transactions = await transactionsRepository.find();
  const balance = await transactionsRepository.getBalance();

  const AllTransactions = { transactions, balance }

  return response.json(AllTransactions);
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;
  const categoriesRepository = getCustomRepository(CategoriesRepository);

  const CategoriesExists = await categoriesRepository.findOne({
    title: category,
  });

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

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTransaction = new DeleteTransactionService()

  await deleteTransaction.execute(id)


  return response.status(204).send()
});

transactionsRouter.post('/import', upload.single('file') , async (request, response) => {
  const importTransactions = new ImportTransactionsService();

  const transactions = await importTransactions.execute(request.file.path)


  return response.json(transactions)


});

export default transactionsRouter;
