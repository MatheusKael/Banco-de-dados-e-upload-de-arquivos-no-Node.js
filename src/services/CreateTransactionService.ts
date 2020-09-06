import AppError from '../errors/AppError';

import { getCustomRepository } from 'typeorm'
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository'
import CategoriesRepository from '../repositories/CategoriesRepository'

interface Request {
  title: string;
  value: number;
  type : 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({ title, value, type, category}: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionsRepository)
    const balance = await transactionRepository.getBalance()
    const categoriesRepository = getCustomRepository(CategoriesRepository)

    if(type === 'outcome' && value > balance.total) {
      throw new AppError('Outcome exeed income value')
    }

    const [{ id }] = await categoriesRepository.find({ title : category})



    const transaction = transactionRepository.create({
    title,
    value,
    type,
    category_id : id ,
    })

    await transactionRepository.save(transaction)

    return transaction;
  }
}

export default CreateTransactionService;
