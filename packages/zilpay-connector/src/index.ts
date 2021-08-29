/* eslint-disable class-methods-use-this */
import { AbstractConnectorArguments, Account, ConnectorUpdate } from '@zilliqa-react/types';
import { AbstractConnector } from '@zilliqa-react/abstract-connector';

const network: any = {
  mainnet: 1,
  testnet: 2,
  private: 3,
};

// eslint-disable-next-line no-underscore-dangle
declare let __DEV__: boolean;
declare let window: any;

export class NoZilliqaProviderError extends Error {
  public constructor() {
    super();
    this.name = this.constructor.name;
    this.message = 'No Zilliqa provider was found on window.zilPay.';
  }
}

export class UserRejectedRequestError extends Error {
  public constructor() {
    super();
    this.name = this.constructor.name;
    this.message = 'The user rejected the request.';
  }
}

export class ZilPayConnector extends AbstractConnector {
  constructor(args: AbstractConnectorArguments) {
    super(args);
    this.handleNetworkChanged = this.handleNetworkChanged.bind(this);
    this.handleAccountsChanged = this.handleAccountsChanged.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  private handleAccountsChanged(accounts: Account): void {
    if (__DEV__) {
      console.log("Handling 'accountsChanged' event with payload", accounts);
    }
    if (accounts === null) {
      this.emitDeactivate();
    } else {
      this.emitUpdate({ account: accounts });
    }
  }

  private handleClose(code: number, reason: string): void {
    if (__DEV__) {
      console.log("Handling 'close' event with payload", code, reason);
    }
    this.emitDeactivate();
  }

  private handleNetworkChanged(networkId: string): void {
    if (__DEV__) {
      console.log("Handling 'networkChanged' event with payload", networkId);
    }
    this.emitUpdate({ networkId: network[networkId], provider: window.zilPay });
  }

  public async activate(): Promise<ConnectorUpdate> {
    if (!window.zilPay) {
      throw new NoZilliqaProviderError();
    }

    if (window.zilPay.wallet) {
      window.zilPay.wallet.observableNetwork().subscribe(this.handleNetworkChanged);
      window.zilPay.wallet.observableAccount().subscribe(this.handleAccountsChanged);
    }

    if ((window.zilPay as any).isConnect) {
      (window.zilPay as any).autoRefreshOnNetworkChange = false;
    }

    let account;
    window.zilPay.wallet.observableAccount().subscribe((result: Account) => {
      account = result;
    });
    if (!account) {
      await window.zilPay.wallet.connect();
      account = window.zilPay.wallet.defaultAccount;
    }

    return { provider: window.zilPay, ...(account ? { account } : {}) };
  }

  public async getProvider(): Promise<any> {
    return window.zilPay;
  }

  getNetworkId(): Promise<string | number> {
    if (!window.zilPay) {
      throw new NoZilliqaProviderError();
    }
    return network[window.zilPay.wallet.net];
  }

  public async getAccount(): Promise<null | Account> {
    if (!window.zilPay) {
      throw new NoZilliqaProviderError();
    }
    return window.zilPay.wallet.defaultAccount;
  }

  public deactivate() {}

  public async isAuthorized(): Promise<boolean> {
    if (!window.zilPay) {
      return false;
    }
    try {
      const status = await window.zilPay.wallet.connect();
      return status === window.zilPay.wallet.isConnect;
    } catch {
      return false;
    }
  }
}
