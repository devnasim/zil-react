import { EventEmitter } from 'events';
import { AbstractConnectorArguments, ConnectorUpdate, ConnectorEvent } from '@zilliqa-react/types';

// eslint-disable-next-line no-underscore-dangle
declare let __DEV__: boolean;
// eslint-disable-next-line import/prefer-default-export
export abstract class AbstractConnector extends EventEmitter {
  public readonly supportedNetworkIds?: number[];

  constructor({ supportedNetworkIds }: AbstractConnectorArguments = {}) {
    super();
    this.supportedNetworkIds = supportedNetworkIds;
  }

  public abstract activate(): Promise<ConnectorUpdate>;

  public abstract getProvider(): Promise<any>;

  public abstract getChainId(): Promise<number | string>;

  public abstract getAccount(): Promise<null | string>;

  public abstract deactivate(): void;

  protected emitUpdate(update: ConnectorUpdate): void {
    if (__DEV__) {
      console.log(`Emitting '${ConnectorEvent.Update}' with payload`, update);
    }
    this.emit(ConnectorEvent.Update, update);
  }

  protected emitError(error: Error): void {
    if (__DEV__) {
      console.log(`Emitting '${ConnectorEvent.Error}' with payload`, error);
    }
    this.emit(ConnectorEvent.Error, error);
  }

  protected emitDeactivate(): void {
    if (__DEV__) {
      console.log(`Emitting '${ConnectorEvent.Deactivate}'`);
    }
    this.emit(ConnectorEvent.Deactivate);
  }
}
