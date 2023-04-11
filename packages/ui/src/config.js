// SPDX-License-Identifier: MIT

const { VUE_APP_CLIENT_ID = '<YOUR CLIENT ID>' } = process.env;

export const config = {
  OAUTH_URL: "https://ssoalpha.dvb.corpinter.net/v1/auth",
  CLIENT_ID: VUE_APP_CLIENT_ID,
  REDIRECT_URI: "http://localhost:8080/",
  SCOPE: "openid mb:vehicle:mbdata:fuelstatus mb:vehicle:mbdata:evstatus",
  API_URL: "http://localhost:3000/api",
};
