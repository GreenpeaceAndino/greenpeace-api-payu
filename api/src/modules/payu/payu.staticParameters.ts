export const payuStaticParameters = {
    language: "es",
    command_transaccion: "SUBMIT_TRANSACTION",
    command_tokenizar_tarjeta: "CREATE_TOKEN",
    merchant: {
        apiKey: process.env.PAYU_API_KEY,
        apiLogin: process.env.PAYU_LOGIN
    },
    currency: "COP",
    transactionType: "AUTHORIZATION_AND_CAPTURE",
    paymentCountry: "CO",
};

