/* eslint-disable no-undef */
// eslint-disable-next-line no-use-before-define
import React, { createContext, useContext, useMemo, Context } from 'react';
import invariant from 'tiny-invariant';

import { ZilReactContextInterface } from './types';
import { useZilReactManager } from './manager';

export const PRIMARY_KEY = 'primary';
const CONTEXTS: { [key: string]: Context<ZilReactContextInterface> } = {};

interface ZilReactProviderArguments {
  getLibrary: (provider?: any, connector?: Required<ZilReactContextInterface>['connector']) => any;
  children: any;
}

export function createZilReactRoot(key: string): (args: ZilReactProviderArguments) => JSX.Element {
  invariant(!CONTEXTS[key], `A root already exists for provided key ${key}`);

  CONTEXTS[key] = createContext<ZilReactContextInterface>({
    activate: async () => {
      invariant(false, 'No <ZilReactProvider ... /> found.');
    },
    setError: () => {
      invariant(false, 'No <ZilReactProvider ... /> found.');
    },
    deactivate: () => {
      invariant(false, 'No <ZilReactProvider ... /> found.');
    },
    active: false,
  });

  CONTEXTS[key].displayName = `ZilReactContext - ${key}`;

  const { Provider } = CONTEXTS[key];

  return function ZilReactProvider({
    getLibrary,
    children,
  }: ZilReactProviderArguments): JSX.Element {
    const { connector, provider, networkId, account, activate, setError, deactivate, error } =
      useZilReactManager();

    const active =
      connector !== undefined && networkId !== undefined && account !== undefined && !error;
    const library = useMemo(
      () =>
        active && networkId !== undefined && Number.isInteger(networkId) && !!connector
          ? getLibrary(provider, connector)
          : undefined,
      [active, getLibrary, provider, connector, networkId],
    );

    const zilReactContext: ZilReactContextInterface = {
      connector,
      library,
      networkId,
      account,
      activate,
      setError,
      deactivate,
      active,
      error,
    };

    return <Provider value={zilReactContext}>{children}</Provider>;
  };
}

export const ZilReactProvider = createZilReactRoot(PRIMARY_KEY);

export function getZilReactContext<T = any>(
  key: string = PRIMARY_KEY,
): Context<ZilReactContextInterface<T>> {
  invariant(Object.keys(CONTEXTS).includes(key), `Invalid key ${key}`);
  return CONTEXTS[key];
}

export function useZilReact<T = any>(key?: string): ZilReactContextInterface<T> {
  return useContext(getZilReactContext(key));
}
