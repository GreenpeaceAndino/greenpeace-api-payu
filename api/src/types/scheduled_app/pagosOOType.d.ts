type TransactionOO = {
  attributes: {
    type: string;
    url: string;
  };
  Id: string;
  s360a__Status2__c: string;
  s360a__Amount__c: number;
  s360a__Opportunity__r: {
    attributes: {
      type: string;
      url: string;
    };
    Id: string;
    s360a__Contact__r: {
      attributes: {
        type: string;
        url: string;
      };
      RUN__c: string;
    };
    TBK_User_Opp__c: string;
  };
};

type PagosOOResponse = {
  totalSize: number;
  done: boolean;
  records: TransactionOO[];
};
