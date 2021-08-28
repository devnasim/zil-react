export interface Account {
  byte20: string;
  bech32: string;
}

export interface AbstractConnectorArguments {
  supportedNetworkIds?: number[];
}

export interface ConnectorUpdate<T = number | string> {
  provider?: any;
  networkId?: T;
  account?: null | Account;
}

// eslint-disable-next-line no-shadow
export enum ConnectorEvent {
  Update = 'ZilReactUpdate',
  Error = 'ZilReactError',
  Deactivate = 'ZilReactDeactivate',
}
