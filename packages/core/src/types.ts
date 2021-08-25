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
  networkId?: number;
  account?: null | string;
  error?: Error;
}

export interface ZilReactContextInterface<T = any> extends ZilReactManagerFunctions {
  connector?: any;
  library?: T;
  networkId?: number;
  account?: null | string;
  active: boolean;
  error?: Error;
}
