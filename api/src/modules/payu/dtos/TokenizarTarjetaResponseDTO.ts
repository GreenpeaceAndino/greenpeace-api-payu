export type TokenizarTarjetaResponseDTO = {
    code: string;
    error: any;
    creditCardToken: any;
    creditCardTokenId: string;
    name: string;
    payerId: string;
    identificationNumber: string;
    paymentMethod: string;
    number: string;
    expirationDate: string;
    creationDate: string;
    maskedNumber: string;
    errorDescription: string;
    status: number;
};