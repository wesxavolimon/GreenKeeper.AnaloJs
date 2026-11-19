import { Auth0Client } from '@auth0/auth0-spa-js';
import { AppConfigPort, AuthPort } from '@application/index';
import { User } from '@domain/index';

export class Auth0Adapter implements AuthPort {
  private auth0Promise: Promise<Auth0Client> | null = null;

  constructor(private readonly appConfig: AppConfigPort) {}

  private get auth0(): Promise<Auth0Client> {
    if (!this.auth0Promise) {
      const { auth0Domain, auth0ClientId } = this.appConfig.getConfig();
      this.auth0Promise = (async () => {
        try {
          return new Auth0Client({
            domain: auth0Domain,
            clientId: auth0ClientId,
            authorizationParams: {
              audience: `https://${auth0Domain}/api/v2`,
              scope: 'openid profile email',
              redirect_uri: window.location.origin,
            },
          });
        } catch {
          return null as unknown as Auth0Client;
        }
      })();
    }
    return this.auth0Promise;
  }

  async login(): Promise<void> {
    const client = await this.auth0;
    if (!client) {
      return;
    }
    await client.loginWithRedirect();
  }

  async logout(): Promise<void> {
    const client = await this.auth0;
    if (!client) {
      return;
    }
    await client.logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  }

  async getUser(): Promise<User | null> {
    const client = await this.auth0;
    if (!client) {
      return null;
    }
    const user = await client.getUser();
    if (!user) {
      return null;
    }
    return {
      id: user.sub ?? '',
      email: user.email ?? '',
      name: user.name ?? '',
      picture: user.picture ?? null,
      provider: 'google',
    };
  }

  async isAuthenticated(): Promise<boolean> {
    const client = await this.auth0;
    if (!client) {
      return false;
    }
    return client.isAuthenticated();
  }
}
