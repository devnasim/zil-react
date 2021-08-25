export enum NetworkId {
  MAINNET = 1,
  TESTNET = 2,
}

export interface ZilReactManagerFunctions {
  activate: (
    connector: any,
    onError?: (error: Error) => void,
    throwErrors?: boolean,
  ) => Promise<void>;
  setError: (error: Error) => void;
  deactivate: () => void;
}

export interface ZilReactManagerReturn extends ZilReactManagerFunctions {
  connector?: any;
  provider?: any;
  networkId?: NetworkId;
  account?: null | string;
  error?: Error;
}

export interface ZilReactContextInterface<T = any> extends ZilReactManagerFunctions {
  connector?: any;
  library?: T;
  networkId?: NetworkId;
  account?: null | string;
  active: boolean;
  error?: Error;
}
