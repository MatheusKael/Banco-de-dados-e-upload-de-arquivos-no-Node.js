import AppError from '../errors/AppError';
import { getCustomRepository } from 'typeorm'

import TransactionsRepository from '../repositories/TransactionsRepository'
import Transaction from '../models/Transaction';


class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transaction = await transactionsRepository.findOne(id)

    if(!transaction) {
      throw new AppError('Transaction does not exist')
    }

    await transactionsRepository.remove(transaction)


  }
}

export default DeleteTransactionService;
