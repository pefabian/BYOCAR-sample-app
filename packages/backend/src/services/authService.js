// SPDX-License-Identifier: MIT

import axios from 'axios';
import createError from 'http-errors';

/**
 * This service is responsible for acquiring an access token via the OAuth 2.0 Authorization Code flow.
 * The authorization code for that needs to be provided by the client.
 */
class AuthService {

  TOKEN_URL = 'https://ssoalpha.dvb.corpinter.net/v1/token';

  constructor(config) {
    this.tryout = config.tryout;
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.redirectUri = config.redirectUri;
	this.scope = config.scope;

    console.log('Instantiated AuthService');
  }

  /**
   * Sends the token request with grant type 'authorization_code' to the configured token URL
   * in order to acquire the access token.
   *
   * @param {*} code the authorization code
   * @returns the access token (or undefined in tryout mode)
   * @throws an error if the token request fails (only if not in tryout mode), or no authorization code was provided
   */
  async getAccessToken(code) {
    const authHeader = authorizationHeader(this.clientId, this.clientSecret);
    const params = prepareRequestParams(code, this.redirectUri, this.scope);

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: authHeader,
    };

    let accessToken;
    try {
      const { data = {} } = await axios.post(this.TOKEN_URL, params, { headers });
      accessToken = data.access_token;
    } catch (err) {
      console.error('Error acquiring access token', err);
    }

    if (!accessToken && !this.tryout) {
      console.error('Did not get an access token')
      throw createError.InternalServerError('Authentication failed');
    }

    console.log(`Acquired access token: ${accessToken}`);

    return accessToken;
  }
};

const prepareRequestParams = (authCode, redirectUri, scope) => {
  if (!authCode) {
    throw createError.BadRequest('No authorization code provided');
  }

  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('code', authCode);
  params.append('redirect_uri', redirectUri);
  params.append('scope', scope);

  return params;
};

const authorizationHeader = (username, password) => {
  const auth = Buffer.from(`${username}:${password}`, 'utf-8').toString('base64');
  return `Basic ${auth}`;
};

export default AuthService;
