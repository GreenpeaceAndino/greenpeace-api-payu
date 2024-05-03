const staticParameters = {
    campaign_id: String(process.env.API_SF_S360AIE__CAMPAIGNID__C),
    country: "Colombia",
    currency: "COP",
    language: "es",
    notifyUrl: "https://www.example.com/notify",
    actionTypeMensual: "New Regular Gift",
    actionTypeUnica: "New One-off Gift",
    actionTypeSuccess: true,
    countryCode: "CO",
    accountType: "none",
    paymentMethod: "PayU",
    processName:  "TFRImport",
    recordTypeId: String(process.env.API_SF_RECORDTYPEID),
    transactionType: "Income",
    transaccionStatusSuccess: "Payment Received",
    transaccionStatusFailed: "Payment Failed",
}

export default staticParameters;