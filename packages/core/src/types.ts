import { AbstractConnector } from '@zilliqa-react/abstract-connector';
import { Account } from '@zilliqa-react/types';

export interface ZilReactManagerFunctions {
  activate: (
    connector: AbstractConnector,
    onError?: (error: Error) => void,
    throwErrors?: boolean,
  ) => Promise<void>;
  setError: (error: Error) => void;
  deactivate: () => void;
}

export interface ZilReactManagerReturn extends ZilReactManagerFunctions {
  connector?: AbstractConnector;
  provider?: any;
  networkId?: number;
  account?: null | Account;
  error?: Error;
}

export interface Web3ReactContextInterface<T = any> extends ZilReactManagerFunctions {
  connector?: AbstractConnector;
  library?: T;
  networkId?: number;
  account?: null | string;

  active: boolean;
  error?: Error;
}
