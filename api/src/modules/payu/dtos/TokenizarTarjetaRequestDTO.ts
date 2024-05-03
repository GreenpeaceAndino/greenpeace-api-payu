import {MerchantDTO} from "./MerchantDTO";
import {CreditCardTokenDTO} from "./CreditCardTokenDTO";

export type TokenizarTarjetaRequestDTO ={
  language: string;
  command: string;
  merchant: MerchantDTO;
  creditCardToken: CreditCardTokenDTO;
}