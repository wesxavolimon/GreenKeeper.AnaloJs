import { Auth0Client } from '@auth0/auth0-spa-js';
import { AppConfigPort, AuthPort } from '@application/index';
import { User } from '@domain/index';

export class Auth0Adapter implements AuthPort {
  private readonly auth0: Auth0Client;

  constructor(private readonly appConfig: AppConfigPort) {
    const { auth0Domain, auth0ClientId } = appConfig.getConfig();
    this.auth0 = new Auth0Client({
      domain: auth0Domain,
      clientId: auth0ClientId,
      authorizationParams: {
        audience: `https://${auth0Domain}/api/v2`,
        scope: 'openid profile email',
        redirect_uri: window.location.origin,
      },
    });
  }

  async login(): Promise<void> {
    await this.auth0.loginWithRedirect();
  }

  async logout(): Promise<void> {
    await this.auth0.logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  }

  async getUser(): Promise<User | null> {
    const user = await this.auth0.getUser();
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
    return this.auth0.isAuthenticated();
  }
}
