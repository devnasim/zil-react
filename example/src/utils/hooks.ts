import { useState, useEffect } from 'react'
import { useZilReact } from '@zilliqa-react/core'
import { zilpay } from './connectors'
import { Account } from '@zilliqa-react/types'

export function useEagerConnect() {
  const { activate, active } = useZilReact()

  const [tried, setTried] = useState(false)

  useEffect(() => {
    zilpay.isAuthorized().then((isAuthorized: boolean) => {
      if (isAuthorized) {
        activate(zilpay, undefined, true).catch(() => {
          setTried(true)
        })
      } else {
        setTried(true)
      }
    })
  }, []) // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true)
    }
  }, [tried, active])

  return tried
}

export function useInactiveListener(suppress: boolean = false) {
  const { active, error, activate } = useZilReact()

  useEffect((): any => {
    const { zilpay } = window as any
    if (zilpay && zilpay.wallet.isConnected && !active && !error && !suppress) {
      const handleAccountsChanged = (accounts: Account) => {
        console.log("Handling 'accountsChanged' event with payload", accounts)
        if (accounts !== null) {
          activate(zilpay)
        }
      }
      const handleNetworkChanged = (networkId: string | number) => {
        console.log("Handling 'networkChanged' event with payload", networkId)
        activate(zilpay)
      }

      zilpay.wallet.observableNetwork().subscribe(handleNetworkChanged);
      zilpay.wallet.observableAccount().subscribe(handleAccountsChanged);
      return () => {}
    }
  }, [active, error, suppress, activate])
}