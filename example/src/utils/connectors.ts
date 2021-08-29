import { ZilPayConnector } from '@zilliqa-react/zilpay-connector'
import { AbstractConnector } from '@zilliqa-react/abstract-connector'

export const zilpay = new ZilPayConnector({ supportedNetworkIds: [1, 2, 3] })