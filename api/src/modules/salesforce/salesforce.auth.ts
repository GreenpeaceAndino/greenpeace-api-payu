import axios from "axios";
import valuesAuthSF from "./enums/valuesAuthSF.enum";

async function authSF(): Promise<string | null> {
  const requestBody = new URLSearchParams({
    grant_type: valuesAuthSF.GRANT_TYPE,
    client_id: valuesAuthSF.CLIENT_ID,
    client_secret: valuesAuthSF.CLIENT_SECRET,
    username: valuesAuthSF.USERNAME,
    password: valuesAuthSF.PASSWORD,
  });

  const token = await axios
    .post(valuesAuthSF.ENDPOINT, requestBody)
    .then(function (response) {
      console.log(response.data);
      console.log(response.data.access_token);
      // Handle the response here
      console.log("SUCCESS");
      return response.data.access_token;
    })
    .catch(function (error) {
      console.error(error);
      // Handle errors here
      return null;
    });
  return token;
}

export default authSF;
