import axios from "axios";

async function getPagos(token: string): Promise<PagosResponse> {
  // Obtengo fecha
  const envDate = String(process.env.API_CLOSE_DATE);
  console.log("El valor de envDate es: " + envDate);
  let closeDate;
  if (envDate !== undefined && envDate !== null && envDate !== "") {
    closeDate = new Date(envDate).toISOString().split("T")[0];
  } else {
    closeDate = new Date().toISOString().split("T")[0];
  }
  console.log(
    "La fecha env es: " + envDate + " y la fecha enviada a SF es: " + closeDate
  );

  // Creo la url
  const baseUrl = process.env.API_URL_GET_PAGOS;
  const query = encodeURIComponent(
    "SELECT Opportunity.s360a__RegularGiving__c, Opportunity.Amount, Opportunity.ID, Opportunity.s360a__RegularGiving__r.Name, "+ 
    "Opportunity.s360a__RegularGiving__r.Credit_Card_Token_RG__c, Opportunity.s360a__RegularGiving__r.UTM_Campaign__c, "+ 
    "Opportunity.s360a__RegularGiving__r.Account_Name__c, Opportunity.s360a__RegularGiving__r.Account_Holder_Tipo_de_Documento_Col__c, "+
    "Opportunity.s360a__RegularGiving__r.Account_Holder_CC__c, Opportunity.s360a__RegularGiving__r.PayU_Card_RG__c, Opportunity.s360a__Contact__r.Name, "+
    "Opportunity.s360a__Contact__r.Tipo_de_Documento_Colombia__c, Opportunity.s360a__Contact__r.Cedula_de_Ciudadan_a__c "+
    "FROM Opportunity "+
    "WHERE ( StageName = 'Open' OR StageName = 'Overdue' ) "+
    `AND CloseDate <= ${closeDate} ` +
    "AND Opportunity.s360a__RegularGiving__r.s360a__CurrentPaymentMethod__c = 'PayU'"+
    "AND Opportunity.s360a__RegularGiving__r.Payment_Method_sub_type__c = '' AND Opportunity.s360a__RegularGiving__r.Credit_Card_Token_RG__c <> ''"
  );

  const url = `${baseUrl}?q=${query}`;
  const getPagos = await axios
    .get<any>(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(function (response) {
      console.log(response.data);
      console.log("SALESFoRCE RESPONSE" + JSON.stringify(response.data));
      // Handle the response here
      console.log("SUCCESS");

      return response.data;
    })
    .catch(function (error) {
      console.error("ERROR DATA " + JSON.stringify(error.response.data));
      throw new Error(`Error in getPagos: ${error.message} pp`);
    });
  return getPagos;
}
export default getPagos;
