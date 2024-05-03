type PagosResponse = {
  totalSize: number;
  done: boolean;
  records: Array<{
    attributes: {
      type: string;
      url: string;
    };
    s360a__RegularGiving__c: string;
    Amount: number;
    Id: string;
    s360a__RegularGiving__r: {
      attributes: {
        type: string;
        url: string;
      };
      Name: string;
      Credit_Card_Token_RG__c: string;
      UTM_Campaign__c: string;
      Account_Name__c: string;
      Account_Holder_Tipo_de_Documento_Col__c: string;
      Account_Holder_CC__c: string;
      PayU_Card_RG__c: string;
      
    };
    s360a__Contact__r: {
      attributes: {
        type: string;
        url: string;
      };
      Name: string;
      Tipo_de_Documento_Colombia__c: string;
      Cedula_de_Ciudadan_a__c: string;
    };
  }>;
};
