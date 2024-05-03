import {MerchantDTO} from "./MerchantDTO";
import {TransactionDTO}  from "./TransactionDTO";

export type TransaccionConTarjetaDTO = {
    language: string;
    command: string;
    test: any;
    merchant: MerchantDTO;
    transaction: TransactionDTO;
}