import {TransactionOrderDTO} from './TransactionOrderDTO';

export type TransactionDTO = {
    order: TransactionOrderDTO;
    creditCardTokenId: string;
    type: string;
    paymentCountry: string;
    paymentMethod: string;
    deviceSessionId: string;
    ipAddress: string;
    userAgent: string;
    cookie: string;
    payer: any; // PayerDTO;
    creditCard: any;// CreditCardDTO;
    extraParameters: any;
}