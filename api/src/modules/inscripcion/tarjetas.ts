type CardLength = {
    max_length: number,
    min_length: number,
}
  
type Tarjeta = {
  [key: string]: CardLength
}

const Tarjetas: Tarjeta = {
    "AMEX": {
      max_length: 15,
      min_length: 15,
    },
    "CODENSA": {
      max_length: 16,
      min_length: 16,
    },
    "DINERS": {
      max_length: 15,
      min_length: 14,
    },
    "MASTERCARD": {
      max_length: 16,
      min_length: 16,
    },
    "MASTERCARD_DEBIT": {
      max_length: 16,
      min_length: 16,
    },
    "VISA": {
      max_length: 16,
      min_length: 16,
    },
    "VISA_DEBIT": {
      max_length: 16,
      min_length: 16,
    },
}
  
export default Tarjetas;