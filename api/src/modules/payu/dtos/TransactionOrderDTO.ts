import {BuyerDTO} from './BuyerDTO';

export type TransactionOrderDTO = {
    accountId: string | undefined;
    referenceCode: string;
    description: string;
    language: string;
    signature: string;
    additionalValues: any;
    buyer: BuyerDTO
}