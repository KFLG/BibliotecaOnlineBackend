import { Injectable } from '@nestjs/common';
import { createLoanDto } from './dto/createLoanDto';
import { BooksService } from 'src/books/books.service';
import { Repository } from 'typeorm';
import { Loan } from './loans.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CostumersService } from 'src/costumers/costumers.service';

@Injectable()
export class LoansService {
    
   
    constructor (
        private booksService:BooksService,
        private  customerService: CostumersService,
        @InjectRepository(Loan) private loanRepository: Repository<Loan>){
       
    }
    async createLoan (createLoan: createLoanDto){
        const foundBook = await this.booksService.getBook(createLoan.bookId)
        const foundCustomer = await this.customerService.getCustomerById(createLoan.customerId)
        
        
        if (foundBook && foundCustomer) {
            const prepareLoan = this.loanRepository.create(createLoan)
            prepareLoan.books = foundBook;
            prepareLoan.costumers = foundCustomer
            return this.loanRepository.save(prepareLoan)
        }
    }

    async getCustomerLoans(idCustomer:number){
        const customer = await this.customerService.getCustomerById(idCustomer)
        return this.loanRepository.findOne({
            where:{
                costumers: customer
            }, relations: {
                books: true
            }
        })
    }
}
