const valuesAuthSF = {
  ENDPOINT: String(process.env.API_URL_AUTH_SF),
  GRANT_TYPE: String(process.env.API_AUTH_SF_GRANT_TYPE),
  CLIENT_ID: String(process.env.API_AUTH_SF_CLIENT_ID),
  CLIENT_SECRET: String(process.env.API_AUTH_SF_CLIENT_SECRET),
  USERNAME: String(process.env.API_AUTH_SF_USERNAME),
  PASSWORD: String(process.env.API_AUTH_SF_PASSWORD),
};

export default valuesAuthSF;
