import { PwaRegistrationPort } from '@application/index';

export interface ServiceWorkerRegistrar {
  register(scriptUrl: string): Promise<unknown>;
}

export class BrowserPwaRegistrationAdapter implements PwaRegistrationPort {
  constructor(
    private readonly getRegistrar: () => ServiceWorkerRegistrar | null = () =>
      'serviceWorker' in navigator ? navigator.serviceWorker : null,
  ) {}

  async registerServiceWorker(): Promise<boolean> {
    const registrar = this.getRegistrar();
    if (!registrar) {
      return false;
    }
    try {
      await registrar.register('/sw.js');
      return true;
    } catch {
      return false;
    }
  }
}
