/* eslint-disable no-unused-expressions */
/* eslint-disable default-case */
/* eslint-disable no-shadow */
import { useReducer, useEffect, useCallback, useRef } from 'react';
import { ConnectorUpdate, ConnectorEvent, Account } from '@zilliqa-react/types';
import { AbstractConnector } from '@zilliqa-react/abstract-connector';
import warning from 'tiny-warning';

import { ZilReactManagerReturn } from './types';

export class StaleConnectorError extends Error {
  constructor() {
    super();
    this.name = this.constructor.name;
  }
}

export class UnsupportedNetworkIdError extends Error {
  public constructor(unsupportedNetworkId: number, supportedNetworkIds?: readonly number[]) {
    super();
    this.name = this.constructor.name;
    this.message = `Unsupported network id: ${unsupportedNetworkId}. Supported network ids are: ${supportedNetworkIds}.`;
  }
}

interface ZilReactManagerState {
  connector?: AbstractConnector;
  provider?: any;
  networkId?: number;
  account?: null | Account;

  onError?: (error: Error) => void;

  error?: Error;
}

enum ActionType {
  ACTIVATE_CONNECTOR,
  UPDATE,
  UPDATE_FROM_ERROR,
  ERROR,
  ERROR_FROM_ACTIVATION,
  DEACTIVATE_CONNECTOR,
}

interface Action {
  type: ActionType;
  payload?: any;
}

// eslint-disable-next-line consistent-return
function reducer(state: ZilReactManagerState, { type, payload }: Action): ZilReactManagerState {
  switch (type) {
    case ActionType.ACTIVATE_CONNECTOR: {
      const { connector, provider, networkId, account, onError } = payload;
      return { connector, provider, networkId, account, onError };
    }
    case ActionType.UPDATE: {
      const { provider, networkId, account } = payload;
      return {
        ...state,
        ...(provider === undefined ? {} : { provider }),
        ...(networkId === undefined ? {} : { networkId }),
        ...(account === undefined ? {} : { account }),
      };
    }
    case ActionType.UPDATE_FROM_ERROR: {
      const { provider, networkId, account } = payload;
      return {
        ...state,
        ...(provider === undefined ? {} : { provider }),
        ...(networkId === undefined ? {} : { networkId }),
        ...(account === undefined ? {} : { account }),
        error: undefined,
      };
    }
    case ActionType.ERROR: {
      const { error } = payload;
      const { connector, onError } = state;
      return {
        connector,
        error,
        onError,
      };
    }
    case ActionType.ERROR_FROM_ACTIVATION: {
      const { connector, error } = payload;
      return {
        connector,
        error,
      };
    }
    case ActionType.DEACTIVATE_CONNECTOR: {
      return {};
    }
  }
}

async function augmentConnectorUpdate(
  connector: AbstractConnector,
  update: ConnectorUpdate,
): Promise<ConnectorUpdate<number | string>> {
  const provider = update.provider === undefined ? await connector.getProvider() : update.provider;
  const [_networkId, _account] = (await Promise.all([
    update.networkId === undefined ? connector.getChainId() : update.networkId,
    update.account === undefined ? connector.getAccount() : update.account,
  ])) as [Required<ConnectorUpdate>['networkId'], Required<ConnectorUpdate>['account']];

  return { provider, networkId: _networkId, account: _account };
}

export function useWeb3ReactManager(): ZilReactManagerReturn {
  const [state, dispatch] = useReducer(reducer, {});
  const { connector, provider, networkId, account, onError, error } = state;
  const updateBusterRef = useRef(-1);
  updateBusterRef.current += 1;

  const activate = useCallback(
    async (
      connector: AbstractConnector,
      onError?: (error: Error) => void,
      throwErrors: boolean = false,
    ): Promise<void> => {
      const updateBusterInitial = updateBusterRef.current;

      let activated = false;
      try {
        const update = await connector.activate().then((update): ConnectorUpdate => {
          activated = true;
          return update;
        });

        const augmentedUpdate = await augmentConnectorUpdate(connector, update);

        if (updateBusterRef.current > updateBusterInitial) {
          throw new StaleConnectorError();
        }
        dispatch({
          type: ActionType.ACTIVATE_CONNECTOR,
          payload: { connector, ...augmentedUpdate, onError },
        });
      } catch (error) {
        if (error instanceof StaleConnectorError) {
          activated && connector.deactivate();
          warning(false, `Suppressed stale connector activation ${connector}`);
        } else if (throwErrors) {
          activated && connector.deactivate();
          throw error;
        } else if (onError) {
          activated && connector.deactivate();
          onError(error);
        } else {
          // we don't call activated && connector.deactivate() here because it'll be handled in the useEffect
          dispatch({ type: ActionType.ERROR_FROM_ACTIVATION, payload: { connector, error } });
        }
      }
    },
    [],
  );

  const setError = useCallback((error: Error): void => {
    dispatch({ type: ActionType.ERROR, payload: { error } });
  }, []);

  const deactivate = useCallback((): void => {
    dispatch({ type: ActionType.DEACTIVATE_CONNECTOR });
  }, []);

  return { connector, provider, networkId, account, activate, setError, deactivate, error };
}
